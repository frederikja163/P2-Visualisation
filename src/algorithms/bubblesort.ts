// Optimized implementation of bubble sort Algorithm
function algBubbleSort(){

  function bubbleSort(arr : number[]){

    var i, j;
    var len = arr.length;

    var isSwapped = false;

    for(i =0; i < len; i++){

      isSwapped = false;

      for(j = 0; j < len; j++){
          if(arr[j] > arr[j + 1]){
            var temp = arr[j]
            arr[j] = arr[j+1];
            arr[j+1] = temp;
            isSwapped = true;
          }
      }

      // IF no two elements were swapped by inner loop, then break 

      if(!isSwapped){
        break;
      }
    }
  }

  // Print the array  
  bubbleSort([5, 45, 23, 243, 35]);
}