import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const IMAGES_DIR = 'public/images';
const BLOG_DIR = 'src/content/blog';
const CATEGORIES_DIR = 'src/content/categories';
const PAGES_DIR = 'src/pages';
const LAYOUTS_DIR = 'src/layouts';

// Check if directory exists
if (!fs.existsSync(IMAGES_DIR)) {
  process.exit(0);
}

const files = fs.readdirSync(IMAGES_DIR);
const supportedExtensions = ['.jpg', '.jpeg', '.png'];

for (const file of files) {
  const ext = path.extname(file).toLowerCase();
  if (supportedExtensions.includes(ext)) {
    const inputPath = path.join(IMAGES_DIR, file);
    const baseName = path.basename(file, ext);
    const outputPath = path.join(IMAGES_DIR, `${baseName}.webp`);

    console.log(`Converting and optimizing: ${file} -> ${baseName}.webp`);

    try {
      // Convert to WebP with high quality compression
      await sharp(inputPath)
        .webp({ quality: 80, effort: 6 })
        .toFile(outputPath);

      // Remove the original non-webp image file
      fs.unlinkSync(inputPath);

      // Update all references in the codebase
      const oldRef = `/images/${file}`;
      const newRef = `/images/${baseName}.webp`;
      updateReferences(oldRef, newRef);
    } catch (err) {
      console.error(`Failed to process ${file}:`, err);
    }
  }
}

function updateReferences(oldRef, newRef) {
  const directoriesToSearch = [BLOG_DIR, CATEGORIES_DIR, PAGES_DIR, LAYOUTS_DIR];
  
  directoriesToSearch.forEach(dir => {
    if (!fs.existsSync(dir)) return;
    
    const scanAndReplace = (currentDir) => {
      const items = fs.readdirSync(currentDir);
      for (const item of items) {
        const fullPath = path.join(currentDir, item);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory()) {
          scanAndReplace(fullPath);
        } else if (stat.isFile()) {
          const ext = path.extname(item).toLowerCase();
          if (['.md', '.mdx', '.astro', '.ts', '.js', '.yaml', '.yml', '.json'].includes(ext)) {
            let content = fs.readFileSync(fullPath, 'utf8');
            if (content.includes(oldRef)) {
              console.log(`Updating reference in: ${fullPath}`);
              // Use global regex to replace all occurrences
              const escapedOldRef = oldRef.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
              content = content.replace(new RegExp(escapedOldRef, 'g'), newRef);
              fs.writeFileSync(fullPath, content, 'utf8');
            }
          }
        }
      }
    };
    
    scanAndReplace(dir);
  });
}
