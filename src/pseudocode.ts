/*
    
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

let oldActiveElement: Element | null = null;

function pseudocodeOnClick(): void {
    // Get the currently active span element, or the last span element.
    let activeElement: Element = document.activeElement;
    if (!(activeElement instanceof HTMLSpanElement)) {
        activeElement = document.querySelector("#right > span:last-child");
    }

    // Runs on the first click and on all clicks which change the active element.
    if (activeElement != oldActiveElement && oldActiveElement != null) {
        if (oldActiveElement.textContent === ""){
            oldActiveElement.remove();
        }
    }

    const text: string = activeElement.textContent;
    const caretPosition: number = getCaretPosition();
    
    // Get the text before and after the carret (cusor).
    const beforeCursor: string = text.slice(0, caretPosition);
    const afterCursor: string = text.slice(caretPosition, text.length);
    
    // Create before and after elements with the correct text.
    if (beforeCursor === ""){
        activeElement.after(createPseudocodeSpan(afterCursor));
    }
    else if (afterCursor === ""){
        activeElement.before(createPseudocodeSpan(beforeCursor));
    }
    else {
        activeElement.before(createPseudocodeSpan(beforeCursor));
        activeElement.after(createPseudocodeSpan(afterCursor));
    }
    
    // Create the new element with the cursor.
    const newElement: HTMLElement = createPseudocodeSpan("");
    activeElement.replaceWith(newElement);
    setCaretPosition(newElement, 0);

    oldActiveElement = newElement;
}

function createPseudocodeSpan(text: string): HTMLElement {
    const element: HTMLElement = document.createElement("span");
    element.setAttribute("contenteditable", "true");
    element.innerText = text;
    return element;
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

function getCaretPosition(): number {
    const selection: Selection = window.getSelection();
    selection.getRangeAt(0);

    return selection.getRangeAt(0).startOffset;
}