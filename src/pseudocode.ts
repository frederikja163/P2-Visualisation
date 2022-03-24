/*
<p class="breakpoint" id="selectedCode" index="7" pseudo="4">

<p id="selectedPseudo" index="4" code="7">




*/


function pseudocode(right: HTMLElement): void
{
    setCaretPosition(document.querySelector("span"), 0);
    right.addEventListener("input", pseudocodeOnInput);
    right.addEventListener("click", pseudocodeOnClick);
}

function pseudocodeOnInput(ev: InputEvent): void
{
    const pseudocode: HTMLElement = ev.target as HTMLElement;
    const text: string = ev.data;
}

function pseudocodeOnClick(): void {
    let activeElement: Element = document.activeElement;
    if (!(activeElement instanceof HTMLSpanElement)) {
        activeElement = document.querySelector("#right > span:last-child");
    }
    const text: string = activeElement.textContent;
    const carretPosition: number = getCarretPosition();
    

    const beforeCursor: string = text.slice(0, carretPosition);
    const afterCursor: string = text.slice(carretPosition, text.length);
    
    const beforeElement: HTMLElement = document.createElement("span");
    beforeElement.setAttribute("contenteditable", "true");
    beforeElement.innerText = beforeCursor;
    activeElement.before(beforeElement);

    const afterElement: HTMLElement = document.createElement("span");
    afterElement.setAttribute("contenteditable", "true");
    afterElement.innerText = afterCursor;
    activeElement.after(afterElement);

    const newElement: HTMLElement = document.createElement("span");
    newElement.setAttribute("contenteditable", "true");
    activeElement.replaceWith(newElement);

    setCaretPosition(newElement, 0);
}

function setCaretPosition(element: HTMLElement, caretPos: number): void {
    const selection: Selection = window.getSelection();
    const range: Range = document.createRange();  
    selection.removeAllRanges();  
    range.selectNodeContents(element); 
    range.collapse(false);
    range.setStart(element, caretPos);
    range.setEnd(element, caretPos);
    selection.addRange(range);
    element.focus();
}

function getCarretPosition(): number {
    const selection: Selection = window.getSelection();
    selection.getRangeAt(0);

    return selection.getRangeAt(0).startOffset;
}

/*
#Code
    <span  id="1">heji</span>
    <span id="2">heji</span>
    <span selected id="3">heji</span>
    <span id="4">heji</span>
    <span id="5">heji</span>

#Pseudocode
    <span id="1">heji</span>
    <span id="3">heji</span>
    <span id="4">heji</span>
    <span id="5">heji</span>
    <span id="1">heji</span>
*/