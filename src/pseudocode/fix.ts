/*
This file inculdes the fixes to all the problem which where encounterd from having spans within an input element.
This includes fixes for enter, tab, delete, right/left arrow keys.
Additionaly it removes ctrl-z, since it works porly and would only confuse the user.
*/

/**Initialize fix function by adding event listeners.*/
function initFix(right: HTMLElement) {
	right.addEventListener("keyup", fixEnter);
	right.addEventListener('keydown', fixTab);
	right.addEventListener("keydown", fixDelete);
	right.addEventListener("keydown", fixArrows);
	right.addEventListener("keydown", fixCtrlZ);
}

/**Fixes the problems with the delete keys in the text of the pseudocode.*/
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

/**Fixes the problems with the right/left arrow keys in the text of the pseudocode.*/
function fixArrows(eventParameters: KeyboardEvent) {

	/*
	CASES
	1. moving out of a currently selected span
	2. moving into a currently selected span
	3. moving from an empty span to a non selected span
	4. moving across a break
	*/

	//Getting and initializing elements and variables
	const direction: number = eventParameters.key === "ArrowLeft" ? -1 : (eventParameters.key === "ArrowRight" ? +1 : 0);
	const caretPosition: number = getCaretPosition();
	const activeElement: HTMLElement = <HTMLElement>document.activeElement;
	if (direction === 0 || (direction < 0 ? caretPosition != 0 : caretPosition != activeElement.innerHTML.length)) return;

	eventParameters.preventDefault();

	const index: string | null = activeElement.getAttribute("index");
	const adjElement = <HTMLElement>(direction < 0 ?
		activeElement.previousElementSibling :
		activeElement.nextElementSibling);

	if (adjElement === null) return;

	const adjadjElement = <HTMLElement>(direction < 0 ?
		adjElement.previousElementSibling :
		adjElement.nextElementSibling);
	const behindElement = <HTMLElement>(direction < 0 ?
		activeElement.nextElementSibling :
		activeElement.previousElementSibling);

	//If moving out of a span of the same index : insert empty span.
	if (activeElement.innerHTML != "") {
		const newElement = createPseudocodeSpan("", index == null ? "" : index);
		newElement.classList.add("highlighted");

		if (adjElement.tagName !== "SPAN") {
			if (direction < 0) adjadjElement.after(newElement);
			else adjadjElement.before(newElement);
		} else {
			insertPseudocodeSpan(newElement, adjElement, direction < 0 ? adjElement.innerText.length - 1 : 1);
		}
		setCaretPosition(newElement, 0);
		oldActiveElement = newElement;
		return;
	}

	//If moving into a span of the same index: place curser in span.
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

/**Merges two elements if they have the same index value.*/
function mergeElements(e1: HTMLElement | null, e2: HTMLElement | null): HTMLElement | null {

	//Gets the indecies (which ) of the given html elements.
	const i1: string | null = e1?.getAttribute("index");
	const i2: string | null = e2?.getAttribute("index");

	//Merges the given html elements.
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

/**Makes sure that tab add the proper number of spaces.*/
function fixTab(eventParameters: KeyboardEvent): void {

	const oldCaretPosition: number = getCaretPosition();
	const activeElement: Element = document.activeElement;

	if (eventParameters.key == "Tab") {

		//Remove default tab properties
		eventParameters.preventDefault();

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

/**Returns a string (insertedString) into another string (defaultString) at a specific index (stringPosition).*/
function insertString(defaultString: string, stringPosition: number, insertedString: string): string {
	return defaultString.slice(0, stringPosition) + insertedString + defaultString.slice(stringPosition);
}

/**Fixes the problems with the enter key within the text of the pseudocode.*/
function fixEnter(eventParameters: KeyboardEvent): void {
	if (eventParameters.key === "Enter") {
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

/**Removes ctrl-z input.*/
function fixCtrlZ(eventParameters: KeyboardEvent) {
	if (eventParameters.key === "z" && eventParameters.getModifierState("Control")) {
		eventParameters.preventDefault();
	}
}

