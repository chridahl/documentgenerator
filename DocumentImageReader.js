var fs = require('fs');
var PNG = require('pngjs2').PNG;

class DocumentImageManager {
  getImageBuffer(filename) {
    return new Promise((resolve, critical) => {
      fs.createReadStream(filename)
        .pipe(new PNG())
        .on('parsed', function() {
          return resolve({
            buffer: this.data,
            width: this.width,
            height: this.height
          });
      });
    });
  }
  writeImageBuffer(filename, buffer, imageWidth, imageHeight) {
    var imageFile = new PNG({width:imageWidth,height:imageHeight});
    imageFile.data = buffer;
    imageFile.pack()
      .pipe(fs.createWriteStream(filename))
      .on('finish', function() {
        //resolve("Done");
        console.log('Written!');
      });
  }
  drawBox(buffer, x, y, width, height, {r,g,b,a}, imageWidth, imageHeight) {
    console.log(`${width}`);
    console.log(`${height}`);
    for (let _y = 0; _y < imageHeight; _y++ ) {
      for (let _x = 0; _x < imageWidth; _x++ ) {
        var idx = (imageWidth * _y + _x) << 2;
        if ( _x >= x && _x <= x + width ) {
          if ( _y >= y && _y <= y + height) {
            buffer[idx] = r;
            buffer[idx+1] = g;
            buffer[idx+2] = b;
            buffer[idx+3] = a;
          }
        }
      }
    }
    return buffer;
  }
}

module.exports = DocumentImageManager;
