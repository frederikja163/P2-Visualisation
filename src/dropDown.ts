let options = document.querySelectorAll(".dropdown-content > a");
let left = document.querySelector("#left");

// Add eventlistener to all dropdown elements. 
for (let option of options){
    option.addEventListener("click", function dropDownSelector(event){
        let dropdownBtn = document.querySelector(".dropdown > button");
        
        switch ((event.target as Element).id){
            case "mergesort": 
                displayCodeAsString(left, algMergeSort);
                dropdownBtn.innerHTML = "MergeSort";
                break;
            case "binarysearch": 
                displayCodeAsString(left, algBinarySearch);
                dropdownBtn.innerHTML = "Binary Search";
                break;
            case "bubblesort": 
                displayCodeAsString(left, algBubbleSort);
                dropdownBtn.innerHTML = "Bubble Sort";
                break;
        } 
    });
} 