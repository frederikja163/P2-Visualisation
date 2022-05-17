/*
The functions within this file handles the spans within the speudocode.
*/

/**Initialize pseudocode and subscribe to the correct events.*/
function pseudocode(right: HTMLElement): void {
    right.addEventListener("click", pseudocodeOnClick);

    //Initializes fix functions.
    initFix(right);
}

//Initializes a variable to keep track of the last active element.
let oldActiveElement: HTMLElement | null = null;

/**Event for when there has been clicked on a pseudocode span.*/
function pseudocodeOnClick(): void {

    // Get the currently active span element, or the last span element.
    let activeElement: HTMLElement | null = document.activeElement as HTMLElement;
    if (!(activeElement instanceof HTMLSpanElement)) {
        activeElement = document.querySelector("#right > span:last-child");
        if (activeElement != null) {
            const textContent: string | null = activeElement.textContent;

            if (textContent) {
                setCaretPosition(activeElement, textContent.length);
            }
        }
    }

    // Runs on the first click and on all clicks which change the active element.
    if (activeElement != oldActiveElement && oldActiveElement != null && oldActiveElement.innerHTML === "") {
        const prevElement: Element | null = oldActiveElement.previousElementSibling;
        const nextElement: Element | null = oldActiveElement.nextElementSibling;
        const prevIndex: string | null = prevElement?.getAttribute("index");
        const nextIndex: string | null = nextElement?.getAttribute("index");

        // Merge the siblings of the old last element if they had the same index.
        if (prevElement != null && nextElement != null && prevIndex === nextIndex) {
            const prevText: string | null = prevElement.textContent;
            const nextText: string | null = nextElement.textContent;

            if (prevText != null && nextText != null && prevIndex != null) {
                const mergedElement: HTMLElement = createPseudocodeSpan(prevText + nextText, prevIndex);
                const previous: Element | null = oldActiveElement.previousElementSibling;
                const next: Element | null = oldActiveElement.nextElementSibling;

                if (previous != null && next != null) {
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

    if (activeElement != null && activeElement.getAttribute("index") === breakpointIndex) {
        oldActiveElement = activeElement;
    }
    else if (activeElement != null && breakpointIndex != null) {
        const newElement: HTMLElement = createPseudocodeSpan("", breakpointIndex);
        newElement.classList.add("highlighted");
        insertPseudocodeSpan(activeElement, newElement, caretPosition);

        oldActiveElement = newElement;
    }

    //remove adjacent empty elements
    const adjElementNext: HTMLElement | null = <HTMLElement | null>document.activeElement.nextElementSibling;
    const adjElementPrev: HTMLElement | null = <HTMLElement | null>document.activeElement.previousElementSibling;
    const activeElementIndex: String = document.activeElement.getAttribute("index");
    if (adjElementNext != null && adjElementNext.getAttribute("index") != null && adjElementNext.getAttribute("index") !== activeElementIndex && adjElementNext.innerHTML === "") adjElementNext.remove();
    if (adjElementPrev != null && adjElementPrev.getAttribute("index") != null && adjElementPrev.getAttribute("index") !== activeElementIndex && adjElementPrev.innerHTML === "") adjElementPrev.remove();

}

/** Splits 'element' into two different html elements, the text is split at 'index'. */
function insertPseudocodeSpan(element: HTMLElement, newSpan: HTMLElement, index: number): void {

    //Gets the inner text of the given element
    const text: string = element.innerText;

    // Get the text before and after HtmlElementer the index.
    const beforeText: string = text.slice(0, index);
    const afterText: string = text.slice(index, text.length);
    const elementIndex: string | null = element.getAttribute("index");

    // Create before and after elements with the correct text.
    if (elementIndex != null) {
        if (beforeText === "") {
            //Only adds the text after the given index.
            const afterElement: HTMLElement = createPseudocodeSpan(afterText, elementIndex);
            if (element.classList.contains("highlighted")) afterElement.classList.add("highlighted");
            element.after(afterElement);
        }
        else if (afterText === "") {
            //Only adds the text before the given index.
            const beforeElement: HTMLElement = createPseudocodeSpan(beforeText, elementIndex);
            if (element.classList.contains("highlighted")) beforeElement.classList.add("highlighted");
            element.before(beforeElement);
        }
        else {
            //Adds both the text before and after the given index.
            const beforeElement: HTMLElement = createPseudocodeSpan(beforeText, elementIndex);
            const afterElement: HTMLElement = createPseudocodeSpan(afterText, elementIndex);
            if (element.classList.contains("highlighted")) {
                afterElement.classList.add("highlighted");
                beforeElement.classList.add("highlighted");
            }
            element.before(beforeElement);
            element.after(afterElement);
        }
    }

    element.replaceWith(newSpan);
    setCaretPosition(newSpan, 0);
}

/** Create a span for pseudocode with 'text' and index='codeIndex'. */
function createPseudocodeSpan(text: string, codeIndex: string): HTMLElement {
    const element: HTMLElement = document.createElement("span");

    //Adds atributes such as contenteditable, index and innerText
    element.setAttribute("contenteditable", "true");
    element.setAttribute("index", codeIndex);
    element.innerText = text;

    return element;
}

/** Sets the caret position on 'element' to 'caretPos'. */
function setCaretPosition(element: HTMLElement, caretPos: number): void {
    //Gets the selection
    const selection: Selection | null = window.getSelection();
    const node = element.childNodes.length != 0 ? element.firstChild : element;

    if (selection == null) return;
    const range: Range = document.createRange();

    //Sets the selection to the given caret position.
    selection.removeAllRanges();
    range.selectNodeContents(node);
    range.collapse(false);
    range.setStart(node, caretPos);
    range.setEnd(node, caretPos);
    selection.addRange(range);
    element.focus();
}

/**Gets the current caret position as a number. */
function getCaretPosition(): number {
    const selection: Selection | null = window.getSelection();

    if (selection == null) return -1;
    selection.getRangeAt(0);

    return selection.getRangeAt(0).startOffset;
}
