function initDropDown(): void {
    const left: HTMLElement = <HTMLElement>document.querySelector("#left");
    const dropdownBtn: HTMLButtonElement = <HTMLButtonElement>document.querySelector(".dropbtn");
    const dropdownContent: HTMLButtonElement = <HTMLButtonElement>document.querySelector(".dropdown-content");
    let optionContent: Text;
    let option: HTMLAnchorElement;

    for (let i = 0; i < algorithmList.length; i++) {
        //generate HTML anchors from names in algorithmList
        option = <HTMLAnchorElement>document.createElement("a");
        optionContent = <Text>document.createTextNode(algorithmList[i].name);
        option.appendChild(optionContent);
        dropdownContent.appendChild(option);

        //add eventlistener to current option
        dropdownContent.children[i].addEventListener("click", function () {
            displayCodeAsString(left, algorithmList[i].fnc);
            dropdownBtn.innerHTML = algorithmList[i].name;
        });
    }
}
