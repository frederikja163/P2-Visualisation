/*  TODO:maybe create an array with all the algorithms instead so we only have to add a new algorithm in two places:
        1. In the array (preferably the array should be in a seperate file, maybe algorithms/algorithms.ts)
        2. Add the algorithm code in the correct algorithms/alg.ts file.
    Instead of the current system where it has to be added in:
        1. index.html
        2. algorithms/
        3. Add 4 lines in dropdown.ts
*/

function initDropDown(){
        
    const options: NodeListOf<HTMLAnchorElement> = document.querySelectorAll(".dropdown-content > a");
    const left: HTMLElement | null = document.querySelector("#left");

    // Add eventlistener to all dropdown elements. 
    for (let i = 0; i < options.length; i++){
        options[i].addEventListener("click", function dropDownSelector(event: Event){
            const dropdownBtn = document.querySelector(".dropdown > button");
            
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

}
