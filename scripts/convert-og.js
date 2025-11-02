const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

(async () => {
  try {
    const svgPath = path.join(__dirname, '..', 'img', 'og-image.svg');
    const pngPath = path.join(__dirname, '..', 'img', 'og-image.png');

    if (!fs.existsSync(svgPath)) {
      console.error('SVG source not found:', svgPath);
      process.exit(1);
    }

    // Render SVG to 1200x630 PNG
    await sharp(svgPath)
      .resize(1200, 630, { fit: 'cover' })
      .png({ quality: 90 })
      .toFile(pngPath);

    console.log('Generated PNG:', pngPath);
  } catch (err) {
    console.error('Error generating PNG:', err);
    process.exit(1);
  }
})();