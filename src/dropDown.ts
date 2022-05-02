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
