#!/bin/bash

# ============================================
# Autonomous App Builder - Main Script
# ============================================
# This script orchestrates the autonomous app building process
# using Claude Code with specialized prompts and configurations.

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BUILDER_DIR="$(dirname "$SCRIPT_DIR")"

# Default values
CONFIG_FILE=""
OUTPUT_DIR=""
DRY_RUN=false
VERBOSE=false

# Print banner
print_banner() {
    echo -e "${BLUE}"
    echo "╔══════════════════════════════════════════════════════════════╗"
    echo "║           🚀 Autonomous App Builder for Claude Code          ║"
    echo "║                    10x Quality Guarantee                      ║"
    echo "╚══════════════════════════════════════════════════════════════╝"
    echo -e "${NC}"
}

# Print usage
usage() {
    echo "Usage: $0 [OPTIONS]"
    echo ""
    echo "Options:"
    echo "  -c, --config FILE     Path to app configuration JSON file"
    echo "  -o, --output DIR      Output directory for the generated app"
    echo "  -r, --requirements    Path to requirements markdown file"
    echo "  -t, --template NAME   Use a pre-built template (saas, ecommerce, social)"
    echo "  -d, --dry-run         Show what would be done without executing"
    echo "  -v, --verbose         Enable verbose output"
    echo "  -h, --help            Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 -c config.json -o ./my-app"
    echo "  $0 -t saas -o ./my-saas-app"
    echo "  $0 -r requirements.md -o ./custom-app"
}

# Log functions
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check prerequisites
check_prerequisites() {
    log_info "Checking prerequisites..."

    # Check Node.js
    if ! command -v node &> /dev/null; then
        log_error "Node.js is not installed. Please install Node.js 18+ first."
        exit 1
    fi

    # Check npm
    if ! command -v npm &> /dev/null; then
        log_error "npm is not installed. Please install npm first."
        exit 1
    fi

    # Check Claude Code
    if ! command -v claude &> /dev/null; then
        log_warn "Claude Code CLI not found. Install with: npm install -g @anthropic-ai/claude-code"
    fi

    log_success "Prerequisites check passed"
}

# Load configuration
load_config() {
    local config_path="$1"

    if [[ ! -f "$config_path" ]]; then
        log_error "Configuration file not found: $config_path"
        exit 1
    fi

    log_info "Loading configuration from: $config_path"

    # Extract app name from config
    APP_NAME=$(jq -r '.app.name // "my-app"' "$config_path" | tr ' ' '-' | tr '[:upper:]' '[:lower:]')
    APP_TYPE=$(jq -r '.app.type // "web"' "$config_path")

    log_info "App: $APP_NAME (Type: $APP_TYPE)"
}

# Generate prompt from config
generate_prompt() {
    local config_path="$1"

    cat << 'PROMPT_START'
You are building an application with the following configuration.
Follow the Autonomous App Builder prompts and guidelines to create a 10x quality application.

## Configuration
PROMPT_START

    cat "$config_path"

    cat << 'PROMPT_END'

## Instructions

1. Read the configuration above carefully
2. Follow the build process from the build-app.md prompt
3. Create all necessary files with 10x quality
4. Test and fix any errors automatically
5. Ensure the app is production-ready

Begin building now.
PROMPT_END
}

# Create output directory
setup_output() {
    local dir="$1"

    if [[ -d "$dir" ]]; then
        log_warn "Output directory already exists: $dir"
        read -p "Do you want to continue? (y/n) " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            exit 0
        fi
    else
        mkdir -p "$dir"
    fi

    log_success "Output directory ready: $dir"
}

# Run the builder
run_builder() {
    local config_path="$1"
    local output_dir="$2"

    log_info "Starting autonomous build process..."

    # Change to output directory
    cd "$output_dir"

    # Generate the full prompt
    local prompt=$(generate_prompt "$config_path")

    if [[ "$DRY_RUN" == true ]]; then
        log_info "DRY RUN - Would execute Claude Code with the following prompt:"
        echo "$prompt" | head -50
        echo "..."
        return
    fi

    # Execute Claude Code
    # Option 1: Using claude code directly
    if command -v claude &> /dev/null; then
        echo "$prompt" | claude
    else
        # Option 2: Save prompt for manual execution
        local prompt_file="$output_dir/.builder-prompt.md"
        echo "$prompt" > "$prompt_file"
        log_info "Prompt saved to: $prompt_file"
        log_info "Run: claude -p \"\$(cat $prompt_file)\" to start building"
    fi

    log_success "Build process initiated"
}

# Post-build verification
verify_build() {
    local dir="$1"

    log_info "Verifying build..."

    cd "$dir"

    # Check if package.json exists
    if [[ ! -f "package.json" ]]; then
        log_error "Build verification failed: package.json not found"
        return 1
    fi

    # Check if node_modules exists (if dependencies were installed)
    if [[ ! -d "node_modules" ]]; then
        log_info "Installing dependencies..."
        npm install
    fi

    # Run linting if available
    if npm run lint --if-present &> /dev/null; then
        log_success "Linting passed"
    fi

    # Run type checking if available
    if npm run type-check --if-present &> /dev/null; then
        log_success "Type checking passed"
    fi

    # Try to build
    if npm run build &> /dev/null; then
        log_success "Build successful"
    else
        log_warn "Build had issues - auto-fix might be needed"
    fi

    log_success "Build verification complete"
}

# Main function
main() {
    print_banner

    # Parse arguments
    while [[ $# -gt 0 ]]; do
        case $1 in
            -c|--config)
                CONFIG_FILE="$2"
                shift 2
                ;;
            -o|--output)
                OUTPUT_DIR="$2"
                shift 2
                ;;
            -t|--template)
                TEMPLATE="$2"
                shift 2
                ;;
            -r|--requirements)
                REQUIREMENTS_FILE="$2"
                shift 2
                ;;
            -d|--dry-run)
                DRY_RUN=true
                shift
                ;;
            -v|--verbose)
                VERBOSE=true
                shift
                ;;
            -h|--help)
                usage
                exit 0
                ;;
            *)
                log_error "Unknown option: $1"
                usage
                exit 1
                ;;
        esac
    done

    # Validate arguments
    if [[ -z "$OUTPUT_DIR" ]]; then
        log_error "Output directory is required (-o or --output)"
        usage
        exit 1
    fi

    # Use template config if specified
    if [[ -n "$TEMPLATE" ]]; then
        CONFIG_FILE="$BUILDER_DIR/config/templates/$TEMPLATE.json"
    fi

    # Use default config if none specified
    if [[ -z "$CONFIG_FILE" ]]; then
        CONFIG_FILE="$BUILDER_DIR/config/app-config.json"
    fi

    # Run the build process
    check_prerequisites
    load_config "$CONFIG_FILE"
    setup_output "$OUTPUT_DIR"
    run_builder "$CONFIG_FILE" "$OUTPUT_DIR"

    if [[ "$DRY_RUN" == false ]]; then
        verify_build "$OUTPUT_DIR"
    fi

    echo ""
    log_success "🎉 App building process complete!"
    echo ""
    echo -e "Next steps:"
    echo -e "  1. cd $OUTPUT_DIR"
    echo -e "  2. Review the generated code"
    echo -e "  3. npm run dev"
    echo -e "  4. Open http://localhost:3000"
    echo ""
}

# Run main function
main "$@"
