const fs = require('fs');
const path = require('path');

const filesToCopy = [
  {
    from: 'node_modules/swiper/swiper-bundle.min.css',
    to: 'assets/vendor/css/swiper-bundle.min.css'
  },
  {
    from: 'node_modules/swiper/swiper-bundle.min.js',
    to: 'assets/vendor/js/swiper-bundle.min.js'
  },
  {
    from: 'node_modules/lucide/dist/umd/lucide.min.js',
    to: 'assets/vendor/js/lucide.min.js'
  }
];

filesToCopy.forEach(item => {
  const destDir = path.dirname(path.join(__dirname, '..', item.to));
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
  }
  const src = path.join(__dirname, '..', item.from);
  const dest = path.join(__dirname, '..', item.to);
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, dest);
    console.log(`Copied ${item.from} -> ${item.to}`);
  } else {
    console.warn(`Source not found: ${src}`);
  }
});
