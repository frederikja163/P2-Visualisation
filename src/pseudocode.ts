/*
    TODO: Make enter work - sometimes it makes a double <br tag>
    TODO: Make arrows work
    TODO: Make tabs work
    TODO: Make delete work

*/

/** Initialize pseudocode and subscribe to the correct events. */
function pseudocode(right: HTMLElement): void
{
    right.addEventListener("keyup", pseudocodeOnKeyPress);
    right.addEventListener("click", pseudocodeOnClick);
    right.addEventListener('keydown',pseudocodeOnTab);
}

function pseudocodeOnTab(eventProperties: KeyboardEvent): void
{

    let oldCaretPosition: number = getCaretPosition();
    let activeElement: Element = document.activeElement;
    
    if(eventProperties.key == "Tab")
    {

        //Remove default tab properties
        eventProperties.preventDefault();
        
        //Get caret position of the current line
        let length: number = 0;
        let currentElement: Element = activeElement.previousElementSibling;
    
        while(currentElement != null && currentElement.tagName === "SPAN"){
            length += currentElement.innerHTML.length;
            currentElement = currentElement.previousElementSibling;

        }
        const lineLength: number = length + getCaretPosition();

        //Finds the amount of spaces to insert
        const tabLength: number = 4 - (lineLength % 4); 

        //Create a new sting with tabLength amount of spaces
        let spaces: string = "";
       
        for(let i: number = 0; i < tabLength; i++){
            spaces += " ";
        }
        
        //Insert spaces to the text of activeElement.innerHTML onto getCaretPosition()
        activeElement.innerHTML = insertString(activeElement.innerHTML, getCaretPosition(), spaces);
        
        setCaretPosition(<HTMLElement>activeElement, oldCaretPosition + tabLength);

    }
    
}


function insertString(defaultString: string, stringPosition: number, insertedString: string): string {
    return defaultString.slice(0, stringPosition) + insertedString + defaultString.slice(stringPosition);     
}

function pseudocodeOnKeyPress(e: KeyboardEvent): void {
    if (e.key === "Enter") {
        const breaks: NodeListOf<Element> = document.querySelectorAll("#right > span > br");
        for (let i: number = 0; i < breaks.length; i++) {
            const br = breaks[i];
            br.remove();
        }
        const activeElement: Element = document.activeElement;
        const beforeCursor: string = activeElement.childNodes[0].nodeValue;
        const afterCursor: string = activeElement.childNodes[1].nodeValue;
        
        const beforeElement: HTMLElement = createPseudocodeSpan(beforeCursor, activeElement.getAttribute("index"));
        const breakElement = document.createElement("br");
        const afterElement: HTMLElement = createPseudocodeSpan(afterCursor, activeElement.getAttribute("index"));
        activeElement.replaceWith(beforeElement, breakElement, afterElement);
    }
}

let oldActiveElement: HTMLElement | null = null;

/** Event for when there has been clicked on a pseudocode span. */
function pseudocodeOnClick(): void {
    // Get the currently active span element, or the last span element.
    let activeElement: HTMLElement | null = document.activeElement as HTMLElement;
    if (!(activeElement instanceof HTMLSpanElement)) {
        activeElement = document.querySelector("#right > span:last-child");
        if(activeElement != null){
            const textContent : string | null = activeElement.textContent;
            
            if(textContent){
                setCaretPosition(activeElement, textContent.length);
            }
        }
    }

    // Runs on the first click and on all clicks which change the active element.
    if (activeElement != oldActiveElement && oldActiveElement != null && oldActiveElement.innerHTML === "") {
        const prevElement: Element | null = oldActiveElement.previousElementSibling;
        const nextElement: Element | null = oldActiveElement.nextElementSibling;
        const prevIndex: string | null | undefined = prevElement?.getAttribute("index");
        const nextIndex: string | null | undefined = nextElement?.getAttribute("index");
       
        // Merge the siblings of the old last element if they had the same index.
        if (prevElement != null && nextElement != null && prevIndex === nextIndex){
            const prevText: string | null = prevElement.textContent;
            const nextText: string | null = nextElement.textContent;
            
            if(prevText != null && nextText != null && prevIndex != null){
                const mergedElement: HTMLElement = createPseudocodeSpan(prevText + nextText, prevIndex);
                const previous: Element | null = oldActiveElement.previousElementSibling;
                const next: Element | null =  oldActiveElement.nextElementSibling;
                
                if(previous != null && next != null){
                    previous.remove();
                    next.remove();
                    oldActiveElement.replaceWith(mergedElement);
                }

            }

        }
        else {
            // Remove old active element if it was empty.
            oldActiveElement.remove();
        }
    }

    const caretPosition: number = getCaretPosition();
    
    // Get selected breakpoint index.
    const selectedBreakpoint: HTMLElement | null = document.querySelector("#selectedCode");
    let breakpointIndex: string | null = "-1";
    if (selectedBreakpoint != null) {
        breakpointIndex = selectedBreakpoint.getAttribute("index");  
    }
    
    if(activeElement != null && activeElement.getAttribute("index") === breakpointIndex){
        oldActiveElement = activeElement;
    }
    else if(activeElement != null && breakpointIndex != null){
        splitHtmlElement(activeElement, caretPosition);
        
        // Create the new element with the cursor.
        const newElement: HTMLElement = createPseudocodeSpan("", breakpointIndex);
        activeElement.replaceWith(newElement);
        newElement.classList.add("highlighted");
        setCaretPosition(newElement, 0);
        
        oldActiveElement = newElement;
    }
}

/** Splits 'element' into two different html elements, the text is split at 'index'. */
function splitHtmlElement(element: HTMLElement, index: number) { 
    const text: string = element.innerText;

    // Get the text before and aftsplitHtmlElementer the index.
    const beforeText: string = text.slice(0, index);
    const afterText: string = text.slice(index, text.length);
    const activeElementCodeIndex: string | null = element.getAttribute("index");

    // Create before and after elements with the correct text.
    if(activeElementCodeIndex != null){
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
}

/** Create a span for pseudocode with 'text' and index='codeIndex'. */
function createPseudocodeSpan(text: string, codeIndex: string): HTMLElement {
    const element: HTMLElement = document.createElement("span");
    element.setAttribute("contenteditable", "true");
    element.setAttribute("index", codeIndex);
    element.innerText = text;
    return element;
}

/** Sets the caret position on 'element' to 'caretPos'. */
function setCaretPosition(element: HTMLElement, caretPos: number): void {
    const selection: Selection | null = window.getSelection();
    const node = element.childNodes.length != 0 ? element.firstChild : element;
    if(selection == null) return;
    const range: Range = document.createRange();  
    selection.removeAllRanges();
    range.selectNodeContents(node);
    range.collapse(false);
    range.setStart(node, caretPos);
    range.setEnd(node, caretPos);
    selection.addRange(range);
    element.focus();
}

/** Gets the current caret position as a number. */
function getCaretPosition(): number {
    const selection: Selection | null = window.getSelection();
    if(selection == null) return -1;
    selection.getRangeAt(0);   
    return selection.getRangeAt(0).startOffset;
}