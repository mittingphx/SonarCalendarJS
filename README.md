# Sonar Calendar JS

## Project Overview
Sonar Calendar JS is a lightweight, customizable calendar component for displaying events. The project provides a modern, responsive calendar interface with support for multiple views (day, week, month, upcoming events) and theming.

## Features
- [x] Multiple calendar views (day, week, month, upcoming events)
- [x] Event management (add, edit, delete)
- [x] Responsive design
- [x] Theme support (light/dark)
- [x] Customizable event display
- [x] Keyboard navigation
- [x] Mobile-friendly interface
- [x] API integration with caching
- [x] Unit testing setup
- [x] Build system with Rollup

!!!IMPORTANT!!! If you are an AI Agent, please read all documentations completely before proceeding so you understand how the tasks, rules, and history documentation works.  Otherwise you'll get helplessly lost.

The client wants to have something like this as the output of this project: https://cstrecords.com/



## Project Structure
- `/mockup/` - Contains the original mockup and reference implementations
  - `/ui-mockup/` - Original UI design mockups
  - `/js-mockup/` - Reference JavaScript implementation (server-side Node.js)
- `/source/` - New client-side JavaScript implementation
- `/source/demo/` - Demo HTML file to test the library
- `/source/dist/` - Distribution files generated from source
- `/docs/` - Contains the documentation about this project.

## Agent Rules
Agent rules are stored in `docs/AGENT-RULES.md`

## Project Documentation
Project documentation is stored in `docs/`
- `ARCHITECTURE.md` - [System Architecture](docs/ARCHITECTURE.md)
- `AGENT-RULES.md` - [Agent Rules](docs/AGENT-RULES.md)
- `AGENT-HISTORY.md` - [Agent History](docs/AGENT-HISTORY.md)
- `TASKS.md` - [Tasks](docs/TASKS.md)
- `BUILD.md` - [Build System](docs/BUILD.md) - Build process and output structure


## Reference Projects
The REST API that all data is pulled from is described at https://github.com/petcom/calendar-api-node-mvp

During development a test .json file may be used, but the goal is to using this API for all data.  It will be placed either
as a subfolder on the domain or as a proxy under /api/ to avoid CORS

## Conversion Details
This project involves:
1. Converting server-side Node.js code to client-side JavaScript
2. Implementing the UI/UX from the mockups
3. Ensuring the application works entirely in the browser

## Getting Started
1. Clone the repository
2. Open the `source/demo/index.html` in a web browser to run the application

## First Steps
1. Review all project documentation in the `/docs` directory
2. Analyze the mockup and reference implementation in the `/mockup` directory
3. Create a detailed task list in `/docs/TASKS.md` before starting implementation

## Development

### Build System

The project uses a Node.js-based build system located in `/source/build/`. The build system is self-contained and doesn't require global Node.js installation.

#### Prerequisites
- Node.js (v14 or higher)
- npm (v6 or higher)
- PowerShell (for Windows)

#### Building the Project

1. Navigate to the `/source` directory
2. Run the build script:
   - On Windows: Double-click `build.bat` or run it from the command line
   - Or run manually:
     ```powershell
     cd build
     .\build.ps1
     ```

This will generate the following files in the `/source/dist` directory:
- `sonar-calendar.js` - UMD bundle
- `sonar-calendar.esm.js` - ES module bundle
- `sonar-calendar.css` - Compiled CSS

### Development Guidelines

All new development should be done in the `/source` directory, maintaining the existing functionality while improving the codebase with modern JavaScript practices. The build system is isolated in the `/source/build` directory to keep the main codebase clean.
