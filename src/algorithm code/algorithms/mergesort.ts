/*
This file contains a function which runs an example of the mergesort algorithm.
*/

/**A function which runs the mergesort algorithm.*/
function algMergeSort() {

  /**Mergesort example algorithm.*/
  function mergeSort(array: number[]): number[] {
    if (array.length <= 1) {
      return array;
    }

    const middle = Math.floor(array.length / 2);
    const left = array.slice(0, middle);
    const right = array.slice(middle);

    const sortedLeft = mergeSort(left);
    const sortedRight = mergeSort(right);

    return merge(sortedLeft, sortedRight);
  }

  /**Merge algorithm example*/
  function merge(left: number[], right: number[]): number[] {
    const array: number[] = [];
    let lIndex = 0;
    let rIndex = 0;

    while (lIndex + rIndex < left.length + right.length) {
      const lItem = left[lIndex];
      const rItem = right[rIndex];

      if (lItem == null) {
        array.push(rItem);
        rIndex++;
      }
      else if (rItem == null) {
        array.push(lItem);
        lIndex++;
      }
      else if (lItem < rItem) {
        array.push(lItem);
        lIndex++;
      }
      else {
        array.push(rItem);
        rIndex++;
      }
    }
    return array;
  }

  mergeSort([5, 2, 3, 1, 58]);
} 
