import chalk from 'chalk';
import Table from 'cli-table3';

/**
 * 프로그레스 바 생성
 */
export function progressBar(current, total, width = 20) {
  const percentage = total > 0 ? current / total : 0;
  const filled = Math.round(width * percentage);
  const empty = width - filled;

  const filledBar = chalk.green('█'.repeat(filled));
  const emptyBar = chalk.gray('░'.repeat(empty));

  return `${filledBar}${emptyBar} ${Math.round(percentage * 100)}%`;
}

/**
 * 상태 배지 생성
 */
export function statusBadge(status) {
  const badges = {
    pending: chalk.yellow('○ pending'),
    in_progress: chalk.blue('◐ in_progress'),
    done: chalk.green('✓ done'),
    completed: chalk.green('✓ completed'),
    '설계 중': chalk.yellow('○ 설계 중'),
    '개발 중': chalk.blue('◐ 개발 중'),
    '완료': chalk.green('✓ 완료'),
    '보류': chalk.gray('◌ 보류'),
  };

  return badges[status] || chalk.gray(status);
}

/**
 * 우선순위 배지 생성
 */
export function priorityBadge(priority) {
  const badges = {
    high: chalk.red('high'),
    medium: chalk.yellow('medium'),
    low: chalk.gray('low'),
  };

  return badges[priority] || chalk.gray(priority);
}

/**
 * 헤더 박스 출력
 */
export function printHeader(title, subtitle = '') {
  const width = 65;
  const border = chalk.cyan('─'.repeat(width));

  console.log();
  console.log(chalk.cyan('┌' + border + '┐'));
  console.log(chalk.cyan('│') + chalk.bold.white(` ${title}`.padEnd(width)) + chalk.cyan('│'));
  if (subtitle) {
    console.log(chalk.cyan('│') + chalk.gray(` ${subtitle}`.padEnd(width)) + chalk.cyan('│'));
  }
  console.log(chalk.cyan('└' + border + '┘'));
  console.log();
}

/**
 * 대시보드 요약 출력
 */
export function printDashboardSummary(stats) {
  const { totalFeatures, totalTasks, tasksByStatus, tasksByPriority, progress } = stats;

  console.log(chalk.bold('📊 Project Dashboard'));
  console.log();
  console.log(`  Tasks Progress: ${progressBar(tasksByStatus.done, totalTasks, 30)} (${tasksByStatus.done}/${totalTasks})`);
  console.log();
  console.log(`  ${chalk.green('Done')}: ${tasksByStatus.done}  ${chalk.blue('In Progress')}: ${tasksByStatus.in_progress}  ${chalk.yellow('Pending')}: ${tasksByStatus.pending}`);
  console.log();
  console.log(chalk.bold('  Priority Breakdown:'));
  console.log(`  • ${chalk.red('High priority')}: ${tasksByPriority.high}`);
  console.log(`  • ${chalk.yellow('Medium priority')}: ${tasksByPriority.medium}`);
  console.log(`  • ${chalk.gray('Low priority')}: ${tasksByPriority.low}`);
  console.log();
}

/**
 * 다음 Task 추천 출력
 */
export function printNextTask(nextTask, tasks) {
  if (!nextTask) {
    console.log(chalk.gray('  모든 Task가 완료되었거나, 의존성이 충족된 Task가 없습니다.'));
    return;
  }

  console.log(chalk.bold('🔥 Next Task to Work On:'));
  console.log();
  console.log(`  ${chalk.cyan(nextTask.id)} - ${chalk.white(nextTask.name)}`);
  console.log(`  Priority: ${priorityBadge(nextTask.priority)}  Status: ${statusBadge(nextTask.status)}`);

  if (nextTask.dependencies.length > 0) {
    const depStatus = nextTask.dependencies.map(depId => {
      const dep = tasks.find(t => t.id === depId);
      const icon = dep && ['done', 'completed'].includes(dep.status) ? chalk.green('✓') : chalk.yellow('○');
      return `${icon} ${depId}`;
    }).join(', ');
    console.log(`  Dependencies: ${depStatus}`);
  } else {
    console.log(`  Dependencies: ${chalk.gray('None')}`);
  }
  console.log();
}

/**
 * Feature 테이블 출력
 */
export function printFeatureTable(features, tasks) {
  const table = new Table({
    head: [
      chalk.white('Feature ID'),
      chalk.white('Feature명'),
      chalk.white('Tasks'),
      chalk.white('Progress'),
      chalk.white('Status'),
    ],
    style: {
      head: [],
      border: ['gray'],
    },
  });

  for (const feature of features) {
    const featureTasks = tasks.filter(t => t.featureId === feature.id);
    const doneTasks = featureTasks.filter(t => ['done', 'completed'].includes(t.status)).length;
    const totalTasks = featureTasks.length;

    table.push([
      chalk.cyan(feature.id),
      feature.name,
      `${doneTasks}/${totalTasks}`,
      progressBar(doneTasks, totalTasks, 10),
      statusBadge(feature.status),
    ]);
  }

  console.log(table.toString());
  console.log();
}

/**
 * Task 테이블 출력
 */
export function printTaskTable(tasks, featureId = null) {
  const filteredTasks = featureId
    ? tasks.filter(t => t.featureId === featureId)
    : tasks;

  const table = new Table({
    head: [
      chalk.white('Task ID'),
      chalk.white('Task명'),
      chalk.white('Feature'),
      chalk.white('Priority'),
      chalk.white('Dependencies'),
      chalk.white('Status'),
    ],
    style: {
      head: [],
      border: ['gray'],
    },
    colWidths: [18, 25, 12, 10, 20, 15],
    wordWrap: true,
  });

  for (const task of filteredTasks) {
    const deps = task.dependencies.length > 0
      ? task.dependencies.join(', ')
      : chalk.gray('-');

    table.push([
      chalk.cyan(task.id),
      task.name,
      task.featureId,
      priorityBadge(task.priority),
      deps,
      statusBadge(task.status),
    ]);
  }

  console.log(table.toString());
  console.log();
}

/**
 * 구분선 출력
 */
export function printDivider(char = '─', width = 65) {
  console.log(chalk.gray(char.repeat(width)));
}

/**
 * 에러 메시지 출력
 */
export function printError(message) {
  console.log();
  console.log(chalk.red('❌ Error: ') + message);
  console.log();
}

/**
 * 성공 메시지 출력
 */
export function printSuccess(message) {
  console.log();
  console.log(chalk.green('✅ ') + message);
  console.log();
}

/**
 * 정보 메시지 출력
 */
export function printInfo(message) {
  console.log(chalk.blue('ℹ ') + message);
}
