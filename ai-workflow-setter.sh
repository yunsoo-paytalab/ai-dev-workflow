#!/bin/bash

# AI Workflow Setter Script
# Usage: ai-workflow-setter.sh ${agent-name} ${project-root-dir}
#
# This script copies the ai-workflow-template directory to the project root
# and renames it based on the agent name:
#   - cursor  -> .cursor
#   - claude  -> .claude
#   - augment -> .augment
#
# It also replaces all occurrences of ${AGENT_CONFIG_DIR} in the copied files
# with the appropriate directory name.

set -e  # Exit on error

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored messages
print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_info() {
    echo -e "${YELLOW}[INFO]${NC} $1"
}

# Check if correct number of arguments provided
if [ "$#" -ne 2 ]; then
    print_error "Invalid number of arguments"
    echo "Usage: $0 <agent-name> <project-root-dir>"
    echo ""
    echo "Arguments:"
    echo "  agent-name        : cursor, claude, or augment"
    echo "  project-root-dir  : Target project root directory path"
    echo ""
    echo "Example:"
    echo "  $0 cursor /path/to/my-project"
    exit 1
fi

AGENT_NAME="$1"
PROJECT_ROOT="$2"

# Get the directory where this script is located
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
TEMPLATE_DIR="$SCRIPT_DIR/ai-workflow-template"

# Validate agent name and set target directory name
case "$AGENT_NAME" in
    cursor)
        TARGET_DIR_NAME=".cursor"
        ;;
    claude)
        TARGET_DIR_NAME=".claude"
        ;;
    augment)
        TARGET_DIR_NAME=".augment"
        ;;
    *)
        print_error "Invalid agent name: $AGENT_NAME"
        echo "Valid agent names: cursor, claude, augment"
        exit 1
        ;;
esac

# Validate template directory exists
if [ ! -d "$TEMPLATE_DIR" ]; then
    print_error "Template directory not found: $TEMPLATE_DIR"
    exit 1
fi

# Validate project root directory exists
if [ ! -d "$PROJECT_ROOT" ]; then
    print_error "Project root directory not found: $PROJECT_ROOT"
    exit 1
fi

TARGET_DIR="$PROJECT_ROOT/$TARGET_DIR_NAME"

# Check if target directory already exists
if [ -d "$TARGET_DIR" ]; then
    print_info "Target directory already exists: $TARGET_DIR"
    read -p "Do you want to overwrite it? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        print_info "Operation cancelled"
        exit 0
    fi
    print_info "Removing existing directory..."
    rm -rf "$TARGET_DIR"
fi

# Copy template directory to target
print_info "Copying template directory to $TARGET_DIR..."
cp -r "$TEMPLATE_DIR" "$TARGET_DIR"

# Replace ${AGENT_CONFIG_DIR} in all files
print_info "Replacing \${AGENT_CONFIG_DIR} with $TARGET_DIR_NAME in all files..."

# Find all files (excluding hidden files and directories)
find "$TARGET_DIR" -type f | while read -r file; do
    # Check if file is a text file (skip binary files)
    if file "$file" | grep -q text; then
        # Use sed to replace ${AGENT_CONFIG_DIR} with the target directory name
        if [[ "$OSTYPE" == "darwin"* ]]; then
            # macOS
            sed -i '' "s/\${AGENT_CONFIG_DIR}/$TARGET_DIR_NAME/g" "$file"
            sed -i '' "s/\\\${AGENT_CONFIG_DIR}/$TARGET_DIR_NAME/g" "$file"
        else
            # Linux
            sed -i "s/\${AGENT_CONFIG_DIR}/$TARGET_DIR_NAME/g" "$file"
            sed -i "s/\\\${AGENT_CONFIG_DIR}/$TARGET_DIR_NAME/g" "$file"
        fi
    fi
done

print_success "AI workflow setup completed!"
echo ""
echo "Summary:"
echo "  Agent:        $AGENT_NAME"
echo "  Template:     $TEMPLATE_DIR"
echo "  Target:       $TARGET_DIR"
echo "  Config Dir:   $TARGET_DIR_NAME"
echo ""
print_info "Next steps:"
echo "  1. Navigate to your project: cd $PROJECT_ROOT"
echo "  2. Start the workflow: /workflow start"

