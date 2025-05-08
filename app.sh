#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Project directories
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SOURCE_DIR="${SCRIPT_DIR}/source"
BUILD_SCRIPT="${SOURCE_DIR}/build/build.ps1"
DIST_DIR="${SOURCE_DIR}/dist"

# Print header
print_header() {
    echo -e "${BLUE}┌──────────────────────────────────────────────┐${NC}"
    echo -e "${BLUE}│${NC}   ${YELLOW}Sonar Calendar JS - Development Tool${NC}        ${BLUE}│${NC}"
    echo -e "${BLUE}└──────────────────────────────────────────────┘${NC}"
}

# Print error message and exit
error_exit() {
    echo -e "${RED}ERROR: $1${NC}" >&2
    echo -e "Run '${GREEN}./app.sh help${NC}' for usage instructions."
    exit 1
}

# Print help message
show_help() {
    print_header
    echo -e "${YELLOW}Usage:${NC} ./app.sh [command] [options]\n"
    echo -e "${YELLOW}Commands:${NC}"
    echo -e "  ${GREEN}build${NC}      Build the project"
    echo -e "  ${GREEN}test${NC}       Run tests"
    echo -e "  ${GREEN}help${NC}       Show this help message\n"
    echo -e "${YELLOW}Test Options:${NC}"
    echo -e "  ${GREEN}full${NC}         Run full test (example-full.html)"
    echo -e "  ${GREEN}minified${NC}     Run minified test (example-minified.html)"
    echo -e "  ${GREEN}<pattern>${NC}    Any other pattern will be passed to Node.js test runner\n"
    echo -e "${YELLOW}Examples:${NC}"
    echo -e "  ${GREEN}./app.sh test Calendar${NC}    # Run tests with 'Calendar' in the name"
    echo -e "  ${GREEN}./app.sh test -t 5000${NC}    # Set test timeout to 5000ms\n"
    echo -e "${YELLOW}Flags:${NC}"
    echo -e "  ${GREEN}--nobuild${NC}    Skip building before testing"
}

# Install PowerShell Core on Linux if not present
install_powershell_linux() {
    echo -e "${YELLOW}PowerShell Core is required but not installed.${NC}"
    read -p "Do you want to install PowerShell Core? [Y/n] " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Nn]$ ]]; then
        error_exit "Build aborted. PowerShell Core is required for the build process."
    fi

    echo -e "${BLUE}🔄 Installing PowerShell Core...${NC}"
    
    # Check for package manager and install PowerShell Core
    if command -v apt-get &> /dev/null; then
        # Ubuntu/Debian
        wget -q https://packages.microsoft.com/config/ubuntu/$(lsb_release -rs)/packages-microsoft-prod.deb
        sudo dpkg -i packages-microsoft-prod.deb
        rm packages-microsoft-prod.deb
        sudo apt-get update
        sudo apt-get install -y powershell
    elif command -v dnf &> /dev/null; then
        # Fedora/RHEL
        sudo dnf install -y https://packages.microsoft.com/rhel/7/prod/powershell-lts-7.4.2-1.rh.x86_64.rpm
    elif command -v yum &> /dev/null; then
        # CentOS/RHEL 7
        curl -sL https://packages.microsoft.com/config/rhel/7/prod.repo | sudo tee /etc/yum.repos.d/microsoft.repo
        sudo yum install -y powershell
    else
        error_exit "Unsupported Linux distribution. Please install PowerShell Core manually: https://learn.microsoft.com/en-us/powershell/scripting/install/installing-powershell"
    fi

    if ! command -v pwsh &> /dev/null; then
        error_exit "Failed to install PowerShell Core. Please install it manually and try again."
    fi
    
    echo -e "${GREEN}✅ PowerShell Core installed successfully!${NC}"
}

# Install build dependencies
install_build_deps() {
    echo -e "${BLUE}🔧 Installing build dependencies...${NC}"
    cd "${SOURCE_DIR}" || error_exit "Failed to change to source directory"
    
    # Install dependencies
    if ! npm install --no-fund --no-audit; then
        error_exit "Failed to install dependencies"
    fi
    
    # Install dev dependencies
    if ! npm install --save-dev --no-fund --no-audit; then
        error_exit "Failed to install dev dependencies"
    fi
    
    # Install any missing dependencies from package.json
    if [ -f "package.json" ]; then
        if ! npm ci --no-fund --no-audit; then
            echo -e "${YELLOW}⚠️  'npm ci' failed, trying 'npm install'...${NC}"
            if ! npm install --no-fund --no-audit; then
                error_exit "Failed to install project dependencies"
            fi
        fi
    fi
    
    cd - > /dev/null || error_exit "Failed to return to original directory"
}

# Build the project
build_project() {
    local original_dir="$(pwd)"
    
    # Ensure we're in the project root
    cd "${SCRIPT_DIR}" || error_exit "Failed to change to project root"
    
    echo -e "${BLUE}🚀 Building project...${NC}"
    
    # Check for bash build script first (future compatibility)
    local bash_build_script="${SOURCE_DIR}/build/build.sh"
    
    # Install dependencies first
    install_build_deps
    
    if [ -f "$bash_build_script" ]; then
        # Use bash build script if available
        echo -e "${BLUE}Using native bash build script...${NC}"
        bash "$bash_build_script"
    else
        # Fall back to PowerShell build script
        echo -e "${YELLOW}⚠️  Native bash build script not found. Using PowerShell Core...${NC}"
        
        # Check for PowerShell Core
        if ! command -v pwsh &> /dev/null; then
            if [[ "$OSTYPE" == "linux-gnu"* ]]; then
                install_powershell_linux
            else
                error_exit "PowerShell Core is required. Please install it and try again."
            fi
        fi
        
        # Run PowerShell build script
        cd "${SOURCE_DIR}/build" || error_exit "Failed to change to build directory"
        if ! pwsh -ExecutionPolicy Bypass -File "$(basename "$BUILD_SCRIPT")"; then
            cd "$original_dir"
            error_exit "Build script failed"
        fi
    fi
    
    # Return to original directory
    cd "$original_dir" || error_exit "Failed to return to original directory"
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ Build completed successfully!${NC}"
    else
        error_exit "Build failed"
    fi
}

# Run tests
run_tests() {
    local test_type=$1
    local no_build=$2
    local example_file=""

    # Handle special test types (full/minified)
    if [[ "$test_type" == "full" || "$test_type" == "minified" ]]; then
        example_file="${DIST_DIR}/${test_type}/example-${test_type}.html"
        
        # Build if needed
        if [ "$no_build" != true ]; then
            build_project
        elif [ ! -f "$example_file" ]; then
            error_exit "Example file not found at ${example_file}. Run without --nobuild first."
        fi

        # Open in default browser
        echo -e "${BLUE}🌐 Opening ${test_type} example in default browser...${NC}"
        if [[ "$OSTYPE" == "darwin"* ]]; then
            open "$example_file"
        elif [[ "$OSTYPE" == "msys" || "$OSTYPE" == "win32" ]]; then
            start "" "$example_file"
        else
            xdg-open "$example_file"
        fi
    else
        # Forward to Node.js test runner
        echo -e "${BLUE}🔍 Running Node.js tests with pattern: ${test_type}${NC}"
        
        # Save current directory
        local original_dir="$(pwd)"
        
        # Change to source directory for tests
        cd "${SOURCE_DIR}" || error_exit "Failed to change to source directory"
        
        if ! command -v npm &> /dev/null; then
            error_exit "npm is required to run tests"
        fi
        
        # Run tests with the provided pattern
        npm test -- --testPathPattern="${test_type}" ${@:3}
        local test_exit_code=$?
        
        # Return to original directory
        cd "$original_dir" || error_exit "Failed to return to original directory"
        
        if [ $test_exit_code -ne 0 ]; then
            exit $test_exit_code
        fi
    fi
}

# Main script execution
main() {
    local command=$1
    local subcommand=$2
    local no_build=false

    # Check for --nobuild flag
    if [[ "$2" == "--nobuild" ]]; then
        no_build=true
        subcommand=$3
    elif [[ "$3" == "--nobuild" ]]; then
        no_build=true
    fi

    case $command in
        build)
            build_project
            ;;
        test)
            if [ -z "$subcommand" ]; then
                error_exit "Test type not specified. Use 'full' or 'minified'"
            fi
            run_tests "$subcommand" "$no_build"
            ;;
        help|--help|-h|'')
            show_help
            ;;
        *)
            error_exit "Unknown command: $command"
            ;;
    esac
}

# Run the main function with all arguments
main "$@"
