#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Error handler
error_exit() {
    echo -e "${RED}ERROR: $1${NC}" >&2
    exit 1
}

# Get the directory where this script is located
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Main installation function
install_dependencies() {
    echo -e "${BLUE}🔧 Installing build dependencies...${NC}"
    
    # Verify we have a package.json in the current directory    
    if [ ! -f "package.json" ]; then
        error_exit "package.json not found in $(pwd)"
    fi
    
    echo -e "${BLUE}📦 Installing dependencies in $(pwd)...${NC}"
    
    # Clean npm cache to avoid potential issues
    echo -e "${BLUE}🧹 Cleaning npm cache...${NC}"
    npm cache clean --force
    
    # Install required global dependencies if missing
    echo -e "${BLUE}🌍 Checking for global dependencies...${NC}"
    if ! npm list -g autoprefixer postcss rollup rollup-plugin-terser rollup-plugin-postcss rollup-plugin-node-resolve rollup-plugin-commonjs @rollup/plugin-json @rollup/plugin-node-resolve @rollup/plugin-commonjs &>/dev/null; then
        echo -e "${YELLOW}⚠️  Installing missing global dependencies...${NC}"
        npm install -g autoprefixer postcss rollup rollup-plugin-terser rollup-plugin-postcss rollup-plugin-node-resolve rollup-plugin-commonjs @rollup/plugin-json @rollup/plugin-node-resolve @rollup/plugin-commonjs
    fi
    
    # Install dependencies
    echo -e "${BLUE}📥 Installing project dependencies...${NC}"
    if ! npm install --no-fund --no-audit; then
        error_exit "Failed to install dependencies"
    fi
    
    # Install dev dependencies
    echo -e "${BLUE}📥 Installing dev dependencies...${NC}"
    if ! npm install --save-dev --no-fund --no-audit; then
        error_exit "Failed to install dev dependencies"
    fi
    
    # Install specific required dependencies
    echo -e "${BLUE}📦 Installing required build dependencies...${NC}"
    npm install --save-dev autoprefixer postcss rollup rollup-plugin-terser rollup-plugin-postcss rollup-plugin-node-resolve rollup-plugin-commonjs @rollup/plugin-json @rollup/plugin-node-resolve @rollup/plugin-commonjs
    
    # Verify all required dependencies are installed
    echo -e "${BLUE}🔍 Verifying all dependencies are installed...${NC}"
    if ! npm list autoprefixer postcss rollup rollup-plugin-terser rollup-plugin-postcss rollup-plugin-node-resolve rollup-plugin-commonjs @rollup/plugin-json @rollup/plugin-node-resolve @rollup/plugin-commonjs &>/dev/null; then
        echo -e "${YELLOW}⚠️  Some dependencies are still missing, trying a full reinstall...${NC}"
        rm -rf node_modules package-lock.json
        npm install --no-fund --no-audit
    fi
    
    echo -e "${GREEN}✅ Dependencies installed successfully!${NC}"
}

# Run the installation
install_dependencies