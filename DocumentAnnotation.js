class DocumentAnnotation {
  constructor(annotationType, x, y, width, height) {
    this.annotationType = annotationType;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }
}

module.exports = DocumentAnnotation;
