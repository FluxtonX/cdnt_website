const Jimp = require('jimp');

Jimp.read('public/assets/cdnt-logo.jpeg')
  .then(image => {
    const hex = image.getPixelColor(10, 10).toString(16).padStart(8, '0');
    // hex is RGBA
    const color = '#' + hex.slice(0, 6).toUpperCase();
    console.log('Detected Color:', color);
  })
  .catch(err => {
    console.error(err);
  });
