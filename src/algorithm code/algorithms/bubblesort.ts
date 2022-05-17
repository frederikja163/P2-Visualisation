/*
An example of a bubblesort algorithm.
*/

/**A function which runs a bublesort algorithm example.*/
function algBubbleSort() {

  /**Optimized implementation of the bubble sort Algorithm.*/
  function bubbleSort(array: number[]): number[] {

    var i, j;
    var len = array.length;

    var isSwapped = false;

    for (i = 0; i < len; i++) {

      isSwapped = false;

      for (j = 0; j < len; j++) {
        if (array[j] > array[j + 1]) {
          var temp = array[j]
          array[j] = array[j + 1];
          array[j + 1] = temp;
          isSwapped = true;
        }
      }

      // If no two elements were swapped by inner loop, then break 

      if (!isSwapped) {
        break;
      }
    }

    // Print the array
    return array;
  }

  bubbleSort([243, 45, 23, 356, 3, 5346, 35, 5]);
}

