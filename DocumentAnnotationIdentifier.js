var DocumentAnnotation = require('./DocumentAnnotation.js');

class DocumentAnnotationIdentifier {
  // Returns pixel color based on annotation type
  getColorByAnnotationType(annotationType) {
    // Text input #00ff7e (r0, g255, b126)
    if ( annotationType === "freetext") {
      return {
        r: 0,
        g: 255,
        b: 126,
        a: 0
      }
    }
    // Check box input #ff0000 (r255, g0, b0)
    else if ( annotationType === "checkbox") {
      return {
        r: 255,
        g: 0,
        b: 0,
        a: 0
      }
    }
  }
  // Returns line start and line end if scan is successfull, else null.
  scanLine(imageBuffer, y, width, annotationType) {
    var color = this.getColorByAnnotationType(annotationType);
    var hasFoundStart = false;
    var lineStart = 0;
    var lineWidth = 0;
    for (let x = 0; x < width; x++ ) {
      var idx = (width * y + x) << 2;
      var red = imageBuffer[idx];
      var green = imageBuffer[idx + 1];
      var blue  = imageBuffer[idx + 2];
      var alpha = imageBuffer[idx + 3];
      if ( red === color.r && green === color.g && blue === color.b ) {
        if (!hasFoundStart) {
          hasFoundStart = true;
          lineStart = x;
        } else {
          lineWidth++;
        }
      }
    }
    if (!hasFoundStart)
      return null;
    return {
      line_start: lineStart,
      line_width: lineWidth
    };
  }

  // Returns an array of class DocumentAnnotation
  // The big flaw here is that annotation boxes of same type cannot share Y-axis. Fix!
  getAnnotations(imageBuffer, width, height, annotationType) {
      // Iterates the buffer and checks for corresponding color codes, then
      // populates an array of type DocumentAnnotation and returns the array.
      var isSearching = false;
      var annotations = [];
      var currentAnnotationStartX = null;
      var currentAnnotationStartY = null;
      var currentAnnotationStopX = null;
      var currentAnnotationStopY = null;
      var previousTextScanResult = null;
      // Iterate the Y-axis
      for(let y = 0; y < height; y++ ) {
        var freeTextScanResult = this.scanLine(imageBuffer, y, width, annotationType);
        if ( freeTextScanResult ) {
          var previousTextScanResult = freeTextScanResult;
          if ( !isSearching ) {
            // Beging annotation
            isSearching = true;
            currentAnnotationStartX = freeTextScanResult.line_start;
            currentAnnotationStartY = y;
          }
        } else {
          if (isSearching) {
            // Close annotation
            currentAnnotationStopX = previousTextScanResult.line_start + previousTextScanResult.line_width;
            currentAnnotationStopY = y;
            isSearching = false;
            var annotation = new DocumentAnnotation(annotationType,
               currentAnnotationStartX,
               currentAnnotationStartY,
               previousTextScanResult.line_width,
               (currentAnnotationStopY - currentAnnotationStartY)
             );
             currentAnnotationStartX = null;
             currentAnnotationStartY = null;
             currentAnnotationStopX = null;
             currentAnnotationStopY = null;
             previousTextScanResult = null;
             annotations.push(annotation);
          }
        }
      }
      return annotations;
    }
}

module.exports = DocumentAnnotationIdentifier;
