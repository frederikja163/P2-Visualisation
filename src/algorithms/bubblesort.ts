// Optimized implementation of bubble sort Algorithm

function algBubbleSort(){
  function bubbleSort(arrary : number[]): number[]{

    var i, j;
    var len = arrary.length;
  
    var isSwapped = false;
  
    for(i =0; i < len; i++){
  
      isSwapped = false;
  
      for(j = 0; j < len; j++){
          if(arrary[j] > arrary[j + 1]){
            var temp = arrary[j]
            arrary[j] = arrary[j+1];
            arrary[j+1] = temp;
            isSwapped = true;
          }
      }
  
      // IF no two elements were swapped by inner loop, then break 
  
      if(!isSwapped){
        break;
      }
    }
  
    // Print the array
    return arrary;
  }
  
  bubbleSort([243, 45, 23, 356, 3, 5346, 35, 5]); 
} 
  
 