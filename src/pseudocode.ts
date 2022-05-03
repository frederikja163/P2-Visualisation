
/*
    TODO: Make enter work - sometimes it makes a double <br tag>
    TODO: Make arrows work
    TODO: Make tabs work
    TODO: Make delete work

*/

/** Initialize pseudocode and subscribe to the correct events. */
function pseudocode(right: HTMLElement): void {
    right.addEventListener("keyup", pseudocodeOnKeyPress);
    right.addEventListener("click", pseudocodeOnClick);
    right.addEventListener("keydown", fixDelete);
    right.addEventListener("keydown", fixArrows);
}

function fixDelete(eventParameters: KeyboardEvent) {
    const caret: number = getCaretPosition();
    const activeElement: HTMLElement = <HTMLElement>document.activeElement;
    let adjElement: HTMLElement;
    let adjAdjElement: HTMLElement = null;
    let adjIsRight: boolean;

    if (eventParameters.key === "Backspace" && caret === 0) { //if "backspace" and at the first position of the span
        //removing the last character from the previous span
        adjElement = <HTMLElement>activeElement.previousElementSibling;
        if (adjElement != null) {
            adjAdjElement = <HTMLElement>adjElement.previousElementSibling;
            adjElement.innerText = adjElement.innerText.slice(0, adjElement.innerText.length - 1);
        }
        adjIsRight = false;
    } else if (eventParameters.key === "Delete" && caret === activeElement.innerText.length) { // "delete" and at the last position of the current span
        //removing the first character from the next span
        adjElement = <HTMLElement>activeElement.nextElementSibling;
        if (adjElement != null) {
            adjAdjElement = <HTMLElement>adjElement.nextElementSibling;
            adjElement.innerText = adjElement.innerText.slice(1, adjElement.innerText.length);
        }
        adjIsRight = true;
    }

    //merge adjacent elements
    if (adjAdjElement != null && adjElement.innerText.length === 0 && adjAdjElement.getAttribute("index") === activeElement.getAttribute("index")) {
        setCaretPosition(adjAdjElement, adjIsRight ? 0 : adjAdjElement.innerText.length);
        oldActiveElement = adjAdjElement;
        eventParameters.preventDefault();
    }

    //if adjacent highlighted pseudocode span is empty: remove it
    if (adjElement != null && adjElement.innerText.length == 0) adjElement.remove();

    //merge adjacent elements
    let mergedElement: HTMLElement = null;

    const newActiveElement: HTMLElement = <HTMLElement>document.activeElement;
    if (newActiveElement.nextElementSibling != null && newActiveElement.nextElementSibling.getAttribute("index") === newActiveElement.getAttribute("index")) {
        const sibSize = newActiveElement.innerText.length;
        mergedElement = mergeElements(newActiveElement, <HTMLElement>newActiveElement.nextElementSibling);
        setCaretPosition(mergedElement, sibSize);
    } else if (newActiveElement.previousElementSibling != null && newActiveElement.previousElementSibling.getAttribute("index") === newActiveElement.getAttribute("index")) {
        const sibSize = (<HTMLElement>newActiveElement.previousElementSibling).innerText.length;
        mergedElement = mergeElements(<HTMLElement>newActiveElement.previousElementSibling, newActiveElement);
        setCaretPosition(mergedElement, sibSize);
    }

    if (mergedElement !== null && newActiveElement.classList.contains("highlighted")) mergedElement.classList.add("highlighted");


}

function fixArrows(eventParameters: KeyboardEvent) {

    const activeElement: HTMLElement = <HTMLElement>document.activeElement;
    let adjElement: HTMLElement = null;
    let adjAdjElement: HTMLElement = null;
    let adjIsRight: boolean;

    let caret: number = getCaretPosition();

    if (eventParameters.key === "ArrowLeft" && caret === 0) {
        //if "backspace" and at the first position of the span
        adjElement = <HTMLElement>activeElement.previousElementSibling;
        if (adjElement != null) adjAdjElement = <HTMLElement>adjElement.previousElementSibling;
        adjIsRight = false;
    } else if (eventParameters.key === "ArrowRight" && caret === activeElement.innerText.length) {
        // "delete" and at the last position of the current span
        adjElement = <HTMLElement>activeElement.nextElementSibling;
        if (adjElement != null) adjAdjElement = <HTMLElement>adjElement.nextElementSibling;
        adjIsRight = true;
    }

    if (adjElement === null) return;

    //setting caret position
    const index: string | null = activeElement.getAttribute("index");
    let newElement: HTMLElement = null;

    if (adjAdjElement != null && adjElement.innerText.length === 1 && adjAdjElement.getAttribute("index") === index) {
        //inserting in existing span
        setCaretPosition(adjAdjElement, adjIsRight ? 0 : adjAdjElement.innerText.length);
        newElement = adjAdjElement;
        eventParameters.preventDefault();
    } else {
        //inserting new empty span
        newElement = createPseudocodeSpan("", index == null ? "" : index);
        if (activeElement.classList.contains("highlighted")) newElement.classList.add("highlighted");

        insertPseudocodeSpan(newElement, adjElement, adjIsRight ? 1 : adjElement.innerText.length - 1);
        setCaretPosition(newElement, 0);
    }

    //removing prev span if empty
    if (activeElement.innerText.length == 0) activeElement.remove();

    //merging previously split spans
    if (adjIsRight) {
        if (newElement.previousElementSibling.previousElementSibling !== null && newElement.previousElementSibling !== null) {
            mergeElements(<HTMLElement>newElement.previousElementSibling.previousElementSibling, <HTMLElement>newElement.previousElementSibling);
        }
    } else if (newElement.nextElementSibling !== null && newElement.nextElementSibling.nextElementSibling !== null) {
        mergeElements(<HTMLElement>newElement.nextElementSibling, <HTMLElement>newElement.nextElementSibling.nextElementSibling);
    }

    oldActiveElement = newElement;

}

let oldActiveElement: HTMLElement | null = null;

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

/** Event for when there has been clicked on a pseudocode span. */
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


        //      splitHtmlElement(activeElement, caretPosition);
        //       
        // Create the new element with the cursor.
        const newElement: HTMLElement = createPseudocodeSpan("", breakpointIndex);
        insertPseudocodeSpan(newElement, activeElement, caretPosition);
        newElement.classList.add("highlighted");
        //      activeElement.replaceWith(newElement);
        //      setCaretPosition(newElement, 0);

        oldActiveElement = newElement;


    }
}

/** Merges two elements if they have the same index value*/
function mergeElements(e1: HTMLElement | null, e2: HTMLElement | null): HTMLElement | null {

    const i1: string | null = e1?.getAttribute("index");
    const i2: string | null = e2?.getAttribute("index");

    // Merge the siblings of the old last element if they had the same index.
    if (e1 != null && e2 != null && i1 != null && i1 === i2) {
        const text1: string = e1.textContent;
        const text2: string = e2.textContent;

        if (text1 != null && text2 != null) {
            const mergedElements: HTMLElement = createPseudocodeSpan(text1 + text2, i1);
            e1.remove();
            e2.replaceWith(mergedElements);

            return mergedElements;
        }
    }

    return null;
}

/** Splits 'element' into two different html elements, the text is split at 'index'. */
function splitHtmlElement(element: HTMLElement, index: number) {
    const text: string = element.innerText;

    // Get the text before and aftsplitHtmlElementer the index.
    const beforeText: string = text.slice(0, index);
    const afterText: string = text.slice(index, text.length);
    const activeElementCodeIndex: string | null = element.getAttribute("index");

    // Create before and after elements with the correct text.
    if (activeElementCodeIndex != null) {
        if (beforeText === "") {
            const afterElement: HTMLElement = createPseudocodeSpan(afterText, activeElementCodeIndex);
            if (element.classList.contains("highlighted")) afterElement.classList.add("highlighted");
            element.after(afterElement);
        }
        else if (afterText === "") {
            const beforeElement: HTMLElement = createPseudocodeSpan(beforeText, activeElementCodeIndex);
            if (element.classList.contains("highlighted")) beforeElement.classList.add("highlighted");
            element.before(beforeElement);
        }
        else {
            const beforeElement: HTMLElement = createPseudocodeSpan(beforeText, activeElementCodeIndex);
            const afterElement: HTMLElement = createPseudocodeSpan(afterText, activeElementCodeIndex);
            if (element.classList.contains("highlighted")) {
                afterElement.classList.add("highlighted");
                beforeElement.classList.add("highlighted");
            }
            element.before(beforeElement);
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

/** Insertes a pseudocode span at the given index in the element. */
function insertPseudocodeSpan(newSpan: HTMLElement, splitableSpan: HTMLElement, index: number) {
    splitHtmlElement(splitableSpan, index);
    splitableSpan.replaceWith(newSpan);
    setCaretPosition(newSpan, 0);
}

/** Sets the caret position on 'element' to 'caretPos'. */
function setCaretPosition(element: HTMLElement, caretPos: number): void {
    const selection: Selection | null = window.getSelection();
    const node = element.childNodes.length != 0 ? element.firstChild : element;
    if (selection == null) return;
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
    if (selection == null) return -1;
    selection.getRangeAt(0);

    return selection.getRangeAt(0).startOffset;
}
