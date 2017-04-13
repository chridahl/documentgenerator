class DocumentAnnotation {
  constructor(annotationType, x, y, width, height) {
    this.annotationType = annotationType;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.buffer = null;
    this.textValue = null;
    this.id = null;
  }
  setId(id) {
    this.id = id;
  }
  getId() {
    return this.id;
  }
  getImageBuffer(buffer) {
    return this.buffer;
  }
  setImageBuffer(buffer) {
    this.buffer = buffer;
  }
  render(textValue, font, extra) {
    // Render here
    //this.buffer = rendered;
  }
  hasTextValue() {
    return this.textValue !== null ? true : false;
  }
}

module.exports = DocumentAnnotation;
