# Sonar Calendar - Source

This directory contains the source code for the Sonar Calendar component.

## Project Structure

```
source/
├── build/                  # Build system files
│   ├── build.ps1           # PowerShell build script
│   ├── package.json         # Project configuration
│   └── rollup.config.js    # Rollup configuration
├── dist/                   # Compiled and minified output files
├── src/
│   ├── components/        # Reusable UI components
│   │   └── Calendar/        # Calendar components
│   │       └── Calendar.js  # Main calendar component
│   ├── styles/              # CSS and theme files
│   │   ├── base.css         # Base styles
│   │   └── themes/          # Theme definitions
│   │       ├── light.css    # Light theme
│   │       └── dark.css     # Dark theme
│   ├── utils/               # Utility functions
│   └── index.js             # Main entry point
├── demo/                    # Demo files
│   └── index.html           # Demo page
└── README.md               # This file
```

## Development

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)
- PowerShell (for Windows)

### Building the Project

1. Navigate to the `source` directory
2. Run the build script:
   - On Windows: Double-click `build.bat` or run it from the command line
   - Or run manually:
     ```powershell
     cd build
     .\build.ps1
     ```

This will:
1. Check for Node.js and npm
2. Install dependencies
3. Create a `dist` directory if it doesn't exist
4. Build the project
5. Output the built files to the `dist` directory

### Output Files

The build process will generate the following files in the `dist` directory:
- `sonar-calendar.js` - UMD bundle
- `sonar-calendar.esm.js` - ES module bundle
- `sonar-calendar.css` - Compiled CSS

## Usage

### Browser

```html
<!DOCTYPE html>
<html>
<head>
  <link rel="stylesheet" href="path/to/sonar-calendar.css">
</head>
<body>
  <div id="calendar"></div>
  
  <script src="path/to/sonar-calendar.js"></script>
  <script>
    const calendar = SonarCalendar.init({
      selector: '#calendar',
      theme: 'light',
      apiUrl: '/api/events'
    });
  </script>
</body>
</html>
```

### ES Modules

```javascript
import { initSonarCalendar } from 'sonar-calendar';

const calendar = initSonarCalendar({
  selector: '#calendar',
  theme: 'dark',
  apiUrl: '/api/events'
});
```
