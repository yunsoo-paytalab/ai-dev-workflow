import { readFile } from 'fs/promises';
import { existsSync } from 'fs';
import { join } from 'path';

/**
 * feature-list.md 파일 경로 찾기
 */
export function findFeatureListPath() {
  const possiblePaths = [
    join(process.cwd(), '.claude/docs/feature-list.md'),
    join(process.cwd(), 'docs/feature-list.md'),
  ];

  for (const path of possiblePaths) {
    if (existsSync(path)) {
      return path;
    }
  }

  return null;
}

/**
 * 개별 Feature 파일 경로 찾기
 */
export function findFeatureFilePath(featureId) {
  const possiblePaths = [
    join(process.cwd(), '.claude/docs/feature-list'),
    join(process.cwd(), 'docs/feature-list'),
  ];

  for (const basePath of possiblePaths) {
    if (existsSync(basePath)) {
      return basePath;
    }
  }

  return null;
}

/**
 * feature-list.md 파싱하여 Feature 목록 추출
 */
export async function parseFeatureList(filePath) {
  const content = await readFile(filePath, 'utf-8');
  const features = [];

  // Feature 목록 테이블 파싱
  // | Feature ID | Feature명 | 카테고리 | Tasks | 상태 | 상세 문서 |
  const featureTableRegex = /\|\s*([A-Z]+-\d+)\s*\|\s*([^|]+)\s*\|\s*([^|]+)\s*\|\s*(\d+)\s*\|\s*([^|]+?)\s*\|(?:\s*\[상세\]\(([^)]+)\)\s*\|)?/g;

  let match;
  while ((match = featureTableRegex.exec(content)) !== null) {
    const status = match[5].trim();
    // 헤더 행 스킵
    if (status === '상태' || status.includes('---')) continue;

    features.push({
      id: match[1].trim(),
      name: match[2].trim(),
      category: match[3].trim(),
      taskCount: parseInt(match[4].trim(), 10),
      status: status,
      detailPath: match[6]?.trim() || '',
    });
  }

  return features;
}

/**
 * feature-list.md에서 전체 Task 목록 파싱
 */
export async function parseTaskList(filePath) {
  const content = await readFile(filePath, 'utf-8');
  const tasks = [];

  // Task 목록 테이블 파싱
  // | Task ID | Task명 | Feature | 우선순위 | 의존성 | 상태 |
  const taskTableRegex = /\|\s*([A-Z]+-\d+-\d+)\s*\|\s*([^|]+)\s*\|\s*([A-Z]+-\d+)\s*\|\s*(high|medium|low)\s*\|\s*([^|]*)\s*\|\s*([^|]+?)\s*\|/gi;

  let match;
  while ((match = taskTableRegex.exec(content)) !== null) {
    const status = match[6].trim().toLowerCase().replace('-', '_');
    // 헤더 행 스킵
    if (status === '상태' || status.includes('---')) continue;

    tasks.push({
      id: match[1].trim(),
      name: match[2].trim(),
      featureId: match[3].trim(),
      priority: match[4].trim().toLowerCase(),
      dependencies: match[5].trim() === '-' ? [] : match[5].trim().split(',').map(d => d.trim()).filter(Boolean),
      status: status,
    });
  }

  return tasks;
}

/**
 * 개별 Feature 파일 파싱하여 Task 상세 정보 추출
 */
export async function parseFeatureFile(filePath) {
  const content = await readFile(filePath, 'utf-8');

  const feature = {
    id: '',
    name: '',
    category: '',
    status: '',
    relatedPages: '',
    permissions: '',
    overview: '',
    requirements: [],
    tasks: [],
    dependencies: {
      preceding: [],
      following: [],
    },
  };

  // Feature ID와 이름 추출
  const titleMatch = content.match(/^#\s*([A-Z]+-\d+):\s*(.+)$/m);
  if (titleMatch) {
    feature.id = titleMatch[1].trim();
    feature.name = titleMatch[2].trim();
  }

  // 기본 정보 추출
  const categoryMatch = content.match(/\*\*카테고리\*\*:\s*(.+)/);
  if (categoryMatch) feature.category = categoryMatch[1].trim();

  const statusMatch = content.match(/\*\*상태\*\*:\s*(.+)/);
  if (statusMatch) feature.status = statusMatch[1].trim();

  // Task 테이블 파싱
  const taskTableRegex = /\|\s*([A-Z]+-\d+-\d+)\s*\|\s*([^|]+)\s*\|\s*(high|medium|low)\s*\|\s*([^|]*)\s*\|\s*(pending|in_progress|done|completed)\s*\|/gi;

  let match;
  while ((match = taskTableRegex.exec(content)) !== null) {
    feature.tasks.push({
      id: match[1].trim(),
      name: match[2].trim(),
      priority: match[3].trim().toLowerCase(),
      dependencies: match[4].trim() === '-' ? [] : match[4].trim().split(',').map(d => d.trim()).filter(Boolean),
      status: match[5].trim().toLowerCase(),
    });
  }

  return feature;
}

/**
 * 통계 계산
 */
export function calculateStats(features, tasks) {
  const totalFeatures = features.length;
  const totalTasks = tasks.length;

  const tasksByStatus = {
    pending: tasks.filter(t => t.status === 'pending').length,
    in_progress: tasks.filter(t => t.status === 'in_progress').length,
    done: tasks.filter(t => ['done', 'completed'].includes(t.status)).length,
  };

  const tasksByPriority = {
    high: tasks.filter(t => t.priority === 'high').length,
    medium: tasks.filter(t => t.priority === 'medium').length,
    low: tasks.filter(t => t.priority === 'low').length,
  };

  const completedTasks = tasksByStatus.done;
  const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // 다음 작업 추천 (의존성 충족된 pending task 중 high 우선순위)
  const readyTasks = tasks.filter(task => {
    if (task.status !== 'pending') return false;

    // 의존성이 모두 완료되었는지 확인
    return task.dependencies.every(depId => {
      const depTask = tasks.find(t => t.id === depId);
      return depTask && ['done', 'completed'].includes(depTask.status);
    });
  });

  const nextTask = readyTasks.sort((a, b) => {
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  })[0] || null;

  return {
    totalFeatures,
    totalTasks,
    tasksByStatus,
    tasksByPriority,
    completedTasks,
    progress,
    nextTask,
    readyTasks,
  };
}
