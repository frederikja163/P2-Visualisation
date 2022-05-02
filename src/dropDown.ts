/*  TODO:maybe create an array with all the algorithms instead so we only have to add a new algorithm in two places:
        1. In the array (preferably the array should be in a seperate file, maybe algorithms/algorithms.ts)
        2. Add the algorithm code in the correct algorithms/alg.ts file.
    Instead of the current system where it has to be added in:
        1. index.html
        2. algorithms/
        3. Add 4 lines in dropdown.ts
*/

function initDropDown(){
        
    
    const left: HTMLElement | null = document.querySelector("#left");
    const dropdownBtn = document.querySelector(".dropbtn");
    const dropdownContent = document.querySelector(".dropdown-content");
    let optionContent, option;

    for(let i = 0 ; i < algorithmList.length ; i++){
        //generate HTML anchors from names in algorithmList
        option = document.createElement("a");
        optionContent = document.createTextNode(algorithmList[i].name);
        option.appendChild(optionContent);
        dropdownContent.appendChild(option);

        //add eventlistener to current option
        dropdownContent.children[i].addEventListener("click", function(){
            displayCodeAsString(left, algorithmList[i].fnc);
            dropdownBtn.innerHTML = algorithmList[i].name;
            }
        );
    }
}
