const breakpointClass: string = "breakpoint";
const selectedCode: string = "selectedCode";

function initBreakpoints(): void {
    const lines: NodeListOf<HTMLSpanElement> = document.querySelectorAll("#code > span");
    for (let i: number = 0; i < lines.length; i++) {
        if (!lines[i].hasAttribute('index')) continue;

        // Listen for events on every lines of code.
        lines[i].addEventListener("dblclick", statementOnDblClick);
        lines[i].addEventListener("click", () => statementOnClick(lines[i]));
    }
}

function statementOnDblClick(): void {
    document.getSelection()?.removeAllRanges();
}

function statementOnClick(line: HTMLSpanElement): void {

    // Stops the current algorithm execution.
    stopCode();
    removeAllHighlighting();

    // only removes highlighted
    if (line.id === selectedCode) {
        line.id = "";
        if (line.classList.contains(breakpointClass))
            line.classList.remove(breakpointClass);
        return;
    }

    // Add breakpoint to algorithm line.
    if (!line.classList.contains(breakpointClass)) {
        line.classList.add(breakpointClass);
    }

    // Selectnig algorithm line.
    const selected: HTMLElement | null = document.querySelector(`#${selectedCode}`);
    line.id = selectedCode;
    highLight(parseInt(line.getAttribute("index")));

    if (selected != null) {
        selected.id = "";
    }

}
