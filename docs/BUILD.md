# Build System Documentation

This document describes the build process and output structure of the Sonar Calendar JS library.

## Build Output Structure

The build process generates the following directory structure in `/source/dist/`:

```
dist/
├── full/                   # Full (unminified) version of the library
│   ├── sonar-calendar.js       # UMD bundle (unminified)
│   ├── sonar-calendar.js.map   # Source map for UMD bundle
│   ├── sonar-calendar.esm.js   # ES module bundle (unminified)
│   ├── sonar-calendar.esm.js.map  # Source map for ES module bundle
│   ├── sonar-calendar.css      # CSS styles (unminified)
│   ├── sonar-calendar.css.map  # Source map for CSS
│   ├── sonar-calendar.esm.css  # ES module CSS (unminified)
│   └── sonar-calendar.esm.css.map  # Source map for ES module CSS
│
├── minified/               # Minified production version of the library
│   ├── sonar-calendar.min.js     # Minified UMD bundle
│   ├── sonar-calendar.min.js.map # Source map for minified UMD bundle
│   ├── sonar-calendar.esm.min.js # Minified ES module bundle
│   ├── sonar-calendar.esm.min.js.map  # Source map for minified ES module
│   ├── sonar-calendar.min.css    # Minified CSS
│   ├── sonar-calendar.min.css.map  # Source map for minified CSS
│   ├── sonar-calendar.esm.min.css  # Minified ES module CSS
│   └── sonar-calendar.esm.min.css.map  # Source map for minified ES module CSS
│
├── example-full.html       # Example using the full (unminified) version
└── example-minified.html    # Example using the minified production version
```

## Example Files

### example-full.html
This file demonstrates how to use the full (unminified) version of the library. It includes:
- The full UMD bundle
- Unminified CSS
- Example initialization code
- Documentation about the files being used

### example-minified.html
This file demonstrates how to use the minified production version of the library. It includes:
- The minified UMD bundle
- Minified CSS
- Example initialization code
- Documentation about the minified files

## Data Loading Options

The Sonar Calendar supports multiple ways to load event data:

### 1. From an API Endpoint

```javascript
SonarCalendar.init({
  selector: '#calendar',
  theme: 'light',
  apiUrl: 'https://api.example.com/events' // API endpoint that returns JSON
});
```

### 2. From a DOM Element

You can load events from a hidden element on the page, which is useful for server-rendered content:

```html
<!-- Hidden pre element with JSON data -->
<pre id="events-data" style="display: none;">
[
  {
    "id": 1,
    "title": "Team Meeting",
    "start": "2025-05-15T10:00:00",
    "end": "2025-05-15T11:30:00",
    "description": "Weekly team sync"
  }
]
</pre>

<script>
  SonarCalendar.init({
    selector: '#calendar',
    theme: 'light',
    dataSelector: '#events-data' // CSS selector for the element containing JSON
  });
</script>
```

### 3. From a Hidden Input Field

```html
<input type="hidden" id="events-input" value='[{"id":1,"title":"Event","start":"2025-05-15T10:00:00"}]'>

<script>
  SonarCalendar.init({
    selector: '#calendar',
    dataSelector: '#events-input' // Works with input elements too
  });
</script>
```

## Building the Project

To build the project, run the following command from the `/source/build/` directory:

```bash
# On Windows
.\build.ps1

# On Unix-based systems (if applicable)
./build.sh
```

The build process will:
1. Clean the output directories
2. Bundle and transpile the JavaScript
3. Process and minify the CSS
4. Generate source maps
5. Create example HTML files

## Development vs Production

- **Development**: Use the files in the `full/` directory for development as they include source maps and are not minified, making debugging easier.
- **Production**: Use the files in the `minified/` directory for production as they are optimized for performance with reduced file sizes.
