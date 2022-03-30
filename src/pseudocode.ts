/*
    Make enter work - sometimes it makes a double click
    Make arrows work
    Make tabs work
    Make delete work
*/

function pseudocode(right: HTMLElement): void
{
    // setCaretPosition(document.querySelector("span"), 0);
    right.addEventListener("input", pseudocodeOnInput);
    right.addEventListener("click", pseudocodeOnClick);
}

function pseudocodeOnInput(ev: InputEvent): void
{
    const pseudocode: HTMLElement = ev.target as HTMLElement;
    const text: string = ev.data;
    const caretPosition: number = getCaretPosition();
}

let oldActiveElement: HTMLElement | null = null;

function pseudocodeOnClick(): void {
    // Get the currently active span element, or the last span element.
    let activeElement: HTMLElement = document.activeElement as HTMLElement;
    if (!(activeElement instanceof HTMLSpanElement)) {
        activeElement = document.querySelector("#right > span:last-child");
        setCaretPosition(activeElement, activeElement.textContent.length - 1);
    }

    // Runs on the first click and on all clicks which change the active element.
    if (activeElement != oldActiveElement && oldActiveElement != null && oldActiveElement.innerHTML === "" ) {
        const prevElement: Element | null = oldActiveElement.previousElementSibling;
        const nextElement: Element | null = oldActiveElement.nextElementSibling;
        const prevIndex: string = prevElement?.getAttribute("index");
        const nextIndex: string = nextElement?.getAttribute("index");
        if (prevElement != null && nextElement != null && prevIndex === nextIndex){
            const prevText: string = prevElement.textContent;
            const nextText: string = nextElement.textContent;
            
            const mergedElement: HTMLElement = createPseudocodeSpan(prevText + nextText, prevIndex);
            oldActiveElement.previousElementSibling.remove();
            oldActiveElement.nextElementSibling.remove();
            oldActiveElement.replaceWith(mergedElement);
        }
        else {
            oldActiveElement.remove();
        }
    }

    const caretPosition: number = getCaretPosition();
    
    const selectedBreakpoint: HTMLElement | null = document.querySelector("#selectedCode");
    let breakpointIndex: string = "-1";
    if (selectedBreakpoint != null) {
        breakpointIndex = selectedBreakpoint.getAttribute("index");  
    }
    
    if(activeElement.getAttribute("index") === breakpointIndex){
        oldActiveElement = activeElement;
    }
    else {
        splitHtmlElement(activeElement, caretPosition);
        
        // Create the new element with the cursor.
        const newElement: HTMLElement = createPseudocodeSpan("", breakpointIndex);
        activeElement.replaceWith(newElement);
        setCaretPosition(newElement, 0);
        
        oldActiveElement = newElement;
    }
}

function splitHtmlElement(element: HTMLElement, index: number) {
    const text: string = element.innerText;

    // Get the text before and after the carret (cusor).
    const beforeText: string = text.slice(0, index);
    const afterText: string = text.slice(index, text.length);
    const activeElementCodeIndex: string = element.getAttribute("index");

    // Create before and after elements with the correct text.
    if (beforeText === ""){
        const afterElement: HTMLElement = createPseudocodeSpan(afterText, activeElementCodeIndex);
        element.after(afterElement);
    }
    else if (afterText === ""){
        const beforeElement: HTMLElement = createPseudocodeSpan(beforeText, activeElementCodeIndex);
        element.before(beforeElement);
    }
    else {
        const beforeElement: HTMLElement = createPseudocodeSpan(beforeText, activeElementCodeIndex);
        element.before(beforeElement);
        
        const afterElement: HTMLElement = createPseudocodeSpan(afterText, activeElementCodeIndex);
        element.after(afterElement);
    }
}

function createPseudocodeSpan(text: string, codeIndex: string): HTMLElement {
    const element: HTMLElement = document.createElement("span");
    element.setAttribute("contenteditable", "true");
    element.setAttribute("index", codeIndex);
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