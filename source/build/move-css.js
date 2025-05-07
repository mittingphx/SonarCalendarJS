const fs = require('fs');
const path = require('path');

const distPath = path.join(__dirname, '..', 'dist');
const fullPath = path.join(distPath, 'full');
const minifiedPath = path.join(distPath, 'minified');

// Ensure directories exist
[fullPath, minifiedPath].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Process CSS files
const processCssFiles = () => {
  const cssFiles = [
    { src: path.join(distPath, 'sonar-calendar.css'), dest: path.join(fullPath, 'sonar-calendar.css') },
    { src: path.join(distPath, 'sonar-calendar.css.map'), dest: path.join(fullPath, 'sonar-calendar.css.map') },
    { src: path.join(distPath, 'sonar-calendar.esm.css'), dest: path.join(fullPath, 'sonar-calendar.esm.css') },
    { src: path.join(distPath, 'sonar-calendar.esm.css.map'), dest: path.join(fullPath, 'sonar-calendar.esm.css.map') }
  ];

  // Move files to full directory
  cssFiles.forEach(({ src, dest }) => {
    try {
      if (fs.existsSync(src)) {
        fs.copyFileSync(src, dest);
        fs.unlinkSync(src);
        console.log(`Moved ${path.basename(src)} to full directory`);
      }
    } catch (error) {
      console.error(`Error processing ${src}:`, error.message);
    }
  });
};

// Minify CSS files
const minifyCssFiles = () => {
  const cssFiles = [
    'sonar-calendar.css',
    'sonar-calendar.esm.css'
  ];

  cssFiles.forEach(file => {
    const src = path.join(fullPath, file);
    const dest = path.join(minifiedPath, file.replace(/\.css$/, '.min.css'));
    
    try {
      if (fs.existsSync(src)) {
        const css = fs.readFileSync(src, 'utf8');
        // Simple minification (remove comments and extra whitespace)
        const minified = css
          .replace(/\/\*[\s\S]*?\*\//g, '')
          .replace(/\s+/g, ' ')
          .replace(/\s*([{}|:;,])\s*/g, '$1')
          .replace(/;}/g, '}')
          .trim();
        
        fs.writeFileSync(dest, minified);
        console.log(`Created minified version: ${path.basename(dest)}`);
        
        // Copy source map if exists
        const mapSrc = `${src}.map`;
        const mapDest = `${dest}.map`;
        if (fs.existsSync(mapSrc)) {
          fs.copyFileSync(mapSrc, mapDest);
          console.log(`Copied source map: ${path.basename(mapDest)}`);
        }
      }
    } catch (error) {
      console.error(`Error minifying ${file}:`, error.message);
    }
  });
};

// Run the processing
console.log('Starting CSS file processing...');
try {
  processCssFiles();
  minifyCssFiles();
  console.log('CSS processing completed successfully!');
} catch (error) {
  console.error('Error during CSS processing:', error);
  process.exit(1);
}
