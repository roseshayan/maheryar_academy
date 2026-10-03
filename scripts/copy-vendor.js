const fs = require('fs');
const path = require('path');

const singleFiles = [
  {
    from: 'node_modules/swiper/swiper-bundle.min.css',
    to: 'assets/vendor/css/swiper-bundle.min.css'
  },
  {
    from: 'node_modules/swiper/swiper-bundle.min.js',
    to: 'assets/vendor/js/swiper-bundle.min.js'
  },
  {
    from: 'node_modules/@fortawesome/fontawesome-free/css/all.min.css',
    to: 'assets/vendor/css/all.min.css'
  },
  {
    from: 'node_modules/sweetalert2/dist/sweetalert2.min.css',
    to: 'assets/vendor/css/sweetalert2.min.css'
  },
  {
    from: 'node_modules/sweetalert2/dist/sweetalert2.all.min.js',
    to: 'assets/vendor/js/sweetalert2.all.min.js'
  },
  {
    from: 'node_modules/toastify-js/src/toastify.css',
    to: 'assets/vendor/css/toastify.min.css'
  },
  {
    from: 'node_modules/toastify-js/src/toastify.js',
    to: 'assets/vendor/js/toastify.min.js'
  }
];

singleFiles.forEach(item => {
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

// Copy FontAwesome Webfonts directory
const webfontsSrc = path.join(__dirname, '..', 'node_modules/@fortawesome/fontawesome-free/webfonts');
const webfontsDest = path.join(__dirname, '..', 'assets/vendor/webfonts');
if (fs.existsSync(webfontsSrc)) {
  if (!fs.existsSync(webfontsDest)) {
    fs.mkdirSync(webfontsDest, { recursive: true });
  }
  fs.readdirSync(webfontsSrc).forEach(file => {
    fs.copyFileSync(path.join(webfontsSrc, file), path.join(webfontsDest, file));
  });
  console.log(`Copied FontAwesome webfonts to assets/vendor/webfonts`);
}
