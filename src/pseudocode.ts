

/** Initialize pseudocode and subscribe to the correct events. */
function pseudocode(right: HTMLElement): void {
    right.addEventListener("keyup", pseudocodeOnKeyPress);
    right.addEventListener("click", pseudocodeOnClick);

    right.addEventListener('keydown', pseudocodeOnTab);

    right.addEventListener("keydown", fixDelete);
    right.addEventListener("keydown", fixArrows);

    right.addEventListener("keydown", fixCtrlZ);
}



//FIXING PSEUDOCODE STUFF ----------------------------------------------------------------

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

    /*
    CASES
    1. moving out of a currently selected span
    2. moving into a currently selected span
    3. moving from an empty span to a non selected span
    4. moving across a break
    */

    let direction: number = eventParameters.key === "ArrowLeft" ? -1 : (eventParameters.key === "ArrowRight" ? +1 : 0);
    let caretPosition: number = getCaretPosition();
    const activeElement: HTMLElement = <HTMLElement>document.activeElement;
    if (direction === 0 || (direction < 0 ? caretPosition != 0 : caretPosition != activeElement.innerHTML.length)) return;

    eventParameters.preventDefault();

    const index: string | null = activeElement.getAttribute("index");
    let adjElement = <HTMLElement>(direction < 0 ?
        activeElement.previousElementSibling :
        activeElement.nextElementSibling);

    if (adjElement === null) return;

    //If moving out of a span of the same index : insert empty span.
    if (activeElement.innerHTML != "") {
        const newElement = createPseudocodeSpan("", index == null ? "" : index);
        newElement.classList.add("highlighted");

        if (adjElement.tagName !== "SPAN") {
            adjElement = <HTMLElement>(direction < 0 ? (adjElement.previousElementSibling) : adjElement.nextElementSibling);
            if (direction < 0) adjElement.after(newElement);
            else adjElement.before(newElement);
        } else {
            insertPseudocodeSpan(newElement, adjElement, direction < 0 ? adjElement.innerText.length - 1 : 1);
        }
        setCaretPosition(newElement, 0);
        oldActiveElement = newElement;
        return;
    }

    //If moving into a span of the same index: place curser in span.
    const adjadjElement = <HTMLElement>(direction < 0 ?
        adjElement.previousElementSibling :
        adjElement.nextElementSibling);
    const behindElement = <HTMLElement>(direction < 0 ?
        activeElement.nextElementSibling :
        activeElement.previousElementSibling);

    if ((adjElement.tagName !== "SPAN" || adjElement.innerHTML.length == 1) && adjadjElement != null &&
        adjadjElement.tagName === "SPAN" && adjadjElement.getAttribute("index") === index) {
        if (behindElement != null && behindElement.tagName === "SPAN" && adjElement.tagName === "SPAN") {
            if (direction < 0) mergeElements(adjElement, behindElement);
            else mergeElements(behindElement, adjElement);
            activeElement.remove();
        }
        setCaretPosition(adjadjElement, direction < 0 ? adjadjElement.innerHTML.length : 0);
        oldActiveElement = adjadjElement;
        return;
    }

    //if moving across a break
    if (adjElement.tagName !== "SPAN") {
        adjElement.remove();
        const br: HTMLBRElement = <HTMLBRElement>document.createElement("br");
        if (direction < 0) {
            if (behindElement !== null && behindElement.tagName !== "SPAN") {
                activeElement.after(br, createPseudocodeSpan("", index));
            } else {
                activeElement.after(br);
            }
        } else {
            if (behindElement !== null && behindElement.tagName !== "SPAN") {
                activeElement.before(createPseudocodeSpan("", index), br);
            } else {
                activeElement.before(br);
            }
        }

        //remove adjacent empty elements
        const adjElementNext: HTMLElement | null = <HTMLElement | null>document.activeElement.nextElementSibling;
        const adjElementPrev: HTMLElement | null = <HTMLElement | null>document.activeElement.previousElementSibling;
        const activeElementIndex: String = document.activeElement.getAttribute("index");
        if (adjElementNext != null && adjElementNext.getAttribute("index") != null && adjElementNext.getAttribute("index") !== activeElementIndex && adjElementNext.innerHTML === "") adjElementNext.remove();
        if (adjElementPrev != null && adjElementPrev.getAttribute("index") != null && adjElementPrev.getAttribute("index") !== activeElementIndex && adjElementPrev.innerHTML === "") adjElementPrev.remove();

        return;
    }

    // Otherwise move the empty
    const adjChar: string = adjElement.innerHTML.charAt(direction < 0 ? adjElement.innerHTML.length - 1 : 0);
    adjElement.innerHTML = direction < 0 ?
        adjElement.innerHTML.slice(0, adjElement.innerHTML.length - 1) :
        adjElement.innerHTML.slice(1);
    const adjIndex: string = adjElement.getAttribute("index");
    if (adjElement.innerHTML === "") {
        adjElement.remove();
    }

    if (behindElement != null && behindElement.tagName === "SPAN") {
        behindElement.innerHTML = direction < 0 ? adjChar + behindElement.innerHTML : behindElement.innerHTML + adjChar;
        return;
    }

    const newElement = createPseudocodeSpan(adjChar, adjIndex);
    if (direction < 0) {
        activeElement.after(newElement);
        return;
    }

    activeElement.before(newElement);

}

function pseudocodeOnTab(eventProperties: KeyboardEvent): void {

    let oldCaretPosition: number = getCaretPosition();
    let activeElement: Element = document.activeElement;

    if (eventProperties.key == "Tab") {

        //Remove default tab properties
        eventProperties.preventDefault();

        //Get caret position of the current line
        let length: number = 0;
        let currentElement: Element = activeElement.previousElementSibling;

        while (currentElement != null && currentElement.tagName === "SPAN") {
            length += currentElement.innerHTML.length;
            currentElement = currentElement.previousElementSibling;

        }
        const lineLength: number = length + getCaretPosition();

        //Finds the amount of spaces to insert
        const tabLength: number = 4 - (lineLength % 4);

        //Create a new sting with tabLength amount of spaces
        let spaces: string = "";

        for (let i: number = 0; i < tabLength; i++) {
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
        //Removes all break tags within spans.
        // const br: NodeListOf<Element> = document.querySelectorAll("#right > span > br");
        // for (let i = 0; i < br.length; i++) {
        //     br[i].remove();
        // }

        const activeElement: Element = document.activeElement;

        //creates a span of the text before the caret position
        const beforeCursor: string = activeElement.childNodes[0].nodeValue.replaceAll("\n", "");
        const beforeElement: HTMLElement = createPseudocodeSpan(beforeCursor, activeElement.getAttribute("index"));
        beforeElement.classList.add("highlighted");

        //creates a span of the text after the caret position
        let afterCursor: string = "";
        for (let i = 1; i < activeElement.childNodes.length && afterCursor === ""; i++) {
            afterCursor = activeElement.childNodes[i].nodeValue.replaceAll("\n", "");
        }

        const afterElement: HTMLElement = createPseudocodeSpan(afterCursor, activeElement.getAttribute("index"));
        afterElement.classList.add("highlighted");

        //creates a break element
        const breakElement = document.createElement("br");

        //inserts elements into the html
        activeElement.replaceWith(beforeElement, breakElement, afterElement);
        setCaretPosition(afterElement, 0);
        oldActiveElement = afterElement;
    }
}

function fixCtrlZ(eventParameters: KeyboardEvent) {
    if (eventParameters.key === "z" && eventParameters.getModifierState("Control")) {
        eventParameters.preventDefault();
    }
}


// PSEUDOCODE CODE ------------------------------------------------------------------------------------

let oldActiveElement: HTMLElement | null = null;

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
        const newElement: HTMLElement = createPseudocodeSpan("", breakpointIndex);
        newElement.classList.add("highlighted");
        insertPseudocodeSpan(newElement, activeElement, caretPosition);

        oldActiveElement = newElement;
    }

    //remove adjacent empty elements
    const adjElementNext: HTMLElement | null = <HTMLElement | null>document.activeElement.nextElementSibling;
    const adjElementPrev: HTMLElement | null = <HTMLElement | null>document.activeElement.previousElementSibling;
    const activeElementIndex: String = document.activeElement.getAttribute("index");
    if (adjElementNext != null && adjElementNext.getAttribute("index") != null && adjElementNext.getAttribute("index") !== activeElementIndex && adjElementNext.innerHTML === "") adjElementNext.remove();
    if (adjElementPrev != null && adjElementPrev.getAttribute("index") != null && adjElementPrev.getAttribute("index") !== activeElementIndex && adjElementPrev.innerHTML === "") adjElementPrev.remove();

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

    // Get the text before and after HtmlElementer the index.
    const beforeText: string = text.slice(0, index);
    const afterText: string = text.slice(index, text.length);
    const elementIndex: string | null = element.getAttribute("index");

    // Create before and after elements with the correct text.
    if (elementIndex != null) {
        if (beforeText === "") {
            const afterElement: HTMLElement = createPseudocodeSpan(afterText, elementIndex);
            if (element.classList.contains("highlighted")) afterElement.classList.add("highlighted");
            element.after(afterElement);
        }
        else if (afterText === "") {
            const beforeElement: HTMLElement = createPseudocodeSpan(beforeText, elementIndex);
            if (element.classList.contains("highlighted")) beforeElement.classList.add("highlighted");
            element.before(beforeElement);
        }
        else {
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
}



// HELPER FUNCTIONS FOR PSEUDOCODE CODE --------------------------------------------------------------------

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



// HELPER HELPER FUNCTIONS FOR PSEUDOCODE CODE ------------------------------------------------------------------

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
