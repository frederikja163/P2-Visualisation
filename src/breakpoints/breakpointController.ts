
//A strings representing the breakpoint class and one representing the id of the selected code.
const breakpointClass: string = "breakpoint";
const selectedCodeId: string = "selectedCode";

/**Initializing breakpoints by adding eventlisteners to algorithm code spans.*/
function initBreakpoints(): void {

    //Loops through all algorithm code span.
    const lines: NodeListOf<HTMLSpanElement> = document.querySelectorAll("#code > span");
    for (let i: number = 0; i < lines.length; i++) {
        if (!lines[i].hasAttribute('index')) continue;

        //Adds listeners to all span elements within the algorithm code.
        lines[i].addEventListener("dblclick", statementOnDblClick);
        lines[i].addEventListener("click", () => statementOnClick(lines[i]));
    }
}

/**Deselecting span elements when double clicking.*/
function statementOnDblClick(): void {

    //Deselects all selected spans.
    document.getSelection()?.removeAllRanges();
}

/**Adds breakpoints to clicked lines of the algorithm code.*/
function statementOnClick(line: HTMLSpanElement): void {

    //Stops the current algorithm execution.
    stopCode();
    removeAllHighlighting();

    //Only removes highlighted
    if (line.id === selectedCodeId) {
        line.id = "";
        if (line.classList.contains(breakpointClass))
            line.classList.remove(breakpointClass);
        return;
    }

    //Add breakpoint to algorithm line.
    if (!line.classList.contains(breakpointClass)) {
        line.classList.add(breakpointClass);
    }

    //Selectnig algorithm line.
    const selected: HTMLElement | null = document.querySelector(`#${selectedCodeId}`);
    line.id = selectedCodeId;
    highLight(parseInt(line.getAttribute("index")));

    if (selected != null) {
        selected.id = "";
    }

}
