var fs = require('fs');
var canvas = require('canvas');
var ArgumentParser = require('argparse').ArgumentParser;
var DocumentImageManager = require('./DocumentImageReader.js');
var DocumentAnnotationIdentifier = require('./DocumentAnnotationIdentifier.js');

var parser = new ArgumentParser({
  version: '0.0.1',
  addHelp: true,
  description: 'Document generator for training of Artificial Neural Networks.'
});

parser.addArgument([ '-i', '--input' ], { help: 'Template input image file', required:true } );
parser.addArgument([ '-o', '--output' ], { help: 'Output directory'  } );

var args = parser.parseArgs();
var inputFile = args.input;
var outputDirectory = args.output || ".";
var documentImageManager = new DocumentImageManager();

documentImageManager.getImageBuffer(inputFile).then((imageData, er) => {
  var documentAnntationIdentifier = new DocumentAnnotationIdentifier();
  var checkboxAnnotations = documentAnntationIdentifier.getAnnotations(
    imageData.buffer,
    imageData.width,
    imageData.height,
    "checkbox");
  var freeTextAnnotations = documentAnntationIdentifier.getAnnotations(
    imageData.buffer,
    imageData.width,
    imageData.height,
    "freetext");
  var annotations = [].concat(checkboxAnnotations).concat(freeTextAnnotations);
  var newImageBuffer = imageData.buffer;
  annotations.forEach((annotation) => {
    console.log(annotation);
    newImageBuffer = documentImageManager.drawBox(newImageBuffer,
      annotation.x,
      annotation.y,
      annotation.width,
      annotation.height,
      {r:255, g: 255, b:255, a:255},
      imageData.width,
      imageData.height);
  });
  // Now we have all coordinates and boxes. Start by testing to replace them.
  documentImageManager.writeImageBuffer("./test.png",
    newImageBuffer,
    imageData.width,
    imageData.height
  );
});
