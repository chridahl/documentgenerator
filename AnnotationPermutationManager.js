var Combinatorics = require('js-combinatorics');

class AnnotationPermutationManager {
  constructor(annotations) {
    this.annotations = annotations;
    this.currentPermutation = null;
    this.permutationCount = 0;
    this.permutator = Combinatorics.power(this.annotations);
  }

  // Returns an array of annotations
  getPermutator() {
    return this.permutator;
  }

}
module.exports = AnnotationPermutationManager;
