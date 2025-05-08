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

# Main installation function
install_dependencies() {
    echo -e "${BLUE}🔧 Installing build dependencies...${NC}"
    
    # Ensure we're in a Node.js project
    if [ ! -f "package.json" ]; then
        error_exit "package.json not found in $(pwd)"
    fi
    
    echo -e "${BLUE}🧹 Cleaning npm cache...${NC}"
    npm cache clean --force

    echo -e "${BLUE}📥 Installing all project dependencies (including dev)...${NC}"
    npm install --no-fund --no-audit || error_exit "npm install failed"

    echo -e "${BLUE}📦 Ensuring required dev dependencies are present...${NC}"
    npm install --save-dev \
        autoprefixer \
        postcss \
        rollup \
        rollup-plugin-terser \
        rollup-plugin-postcss \
        rollup-plugin-node-resolve \
        rollup-plugin-commonjs \
        @rollup/plugin-json \
        @rollup/plugin-node-resolve \
        @rollup/plugin-commonjs || error_exit "dev dependencies failed to install"

    echo -e "${BLUE}🔍 Verifying local dependency presence...${NC}"
    MISSING=0
    for pkg in autoprefixer postcss rollup rollup-plugin-terser rollup-plugin-postcss rollup-plugin-node-resolve rollup-plugin-commonjs @rollup/plugin-json @rollup/plugin-node-resolve @rollup/plugin-commonjs; do
        if ! npm ls "$pkg" &>/dev/null; then
            echo -e "${YELLOW}⚠️  Missing: $pkg${NC}"
            MISSING=1
        fi
    done

    if [ "$MISSING" -eq 1 ]; then
        echo -e "${YELLOW}🔁 Re-attempting full install after cleaning node_modules...${NC}"
        rm -rf node_modules package-lock.json
        npm install --no-fund --no-audit || error_exit "Final install failed"
    fi

    echo -e "${GREEN}✅ All dependencies installed successfully!${NC}"
}

# Run it
install_dependencies
