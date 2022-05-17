/*
This file includes function which hightlight and unhighlights span elements.
*/

/**Adds highlighting to all span elements with the given index.*/
function highLight(index: number): void {
    const codeSpans: NodeListOf<Element> = document.querySelectorAll(`span[index=\"${index}\"]`);
    for (let i: number = 0; i < codeSpans.length; i++) {
        codeSpans[i].classList.add("highlighted");
    }
}

/**Removes highlighting from all span elements with the given index.*/
function removeHighLight(index: number): void {
    const codeSpans: NodeListOf<Element> = document.querySelectorAll(`span[index=\"${index}\"]`);
    for (let i: number = 0; i < codeSpans.length; i++) {
        codeSpans[i].classList.remove("highlighted");
    }
}

/**Removes all algorithm code highligts.*/
function removeAllHighlighting() {
    const lineCount: number = <number>document.querySelectorAll("#code > span")?.length;

    for (let i: number = -1; i < lineCount; i++) {
        removeHighLight(i);
    }
}