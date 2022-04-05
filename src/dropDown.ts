
let options: NodeListOf<HTMLAnchorElement> = document.querySelectorAll(".dropdown-content > a");
let left: HTMLElement | null = document.querySelector("#left");

// Add eventlistener to all dropdown elements. 
for (let i = 0; i < options.length; i++){
    options[i].addEventListener("click", function dropDownSelector(event: Event){
        let dropdownBtn = document.querySelector(".dropdown > button");
        
        switch ((event.target as Element).id){
            case "mergesort": 
                if(left != null) displayCodeAsString(left, algMergeSort);
                if(dropdownBtn != null) dropdownBtn.innerHTML = "MergeSort";
                break;
            case "binarysearch": 
                if(left != null) displayCodeAsString(left, algBinarySearch);
                if(dropdownBtn != null) dropdownBtn.innerHTML = "Binary Search";
                break;
            case "bubblesort": 
                if(left != null) displayCodeAsString(left, algBubbleSort);
                if(dropdownBtn != null) dropdownBtn.innerHTML = "Bubble Sort";
                break;
        } 
    });
} 
