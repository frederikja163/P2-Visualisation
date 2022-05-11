const breakpointClass: string = "breakpoint";
const selectedCode: string = "selectedCode";

function initBreakpoints(): void
{
    const lines: NodeListOf<HTMLSpanElement> = document.querySelectorAll("#code > span");
    for (let i: number = 0; i < lines.length; i++)
    {
        // Listen for events on every lines of code.
        lines[ i ].addEventListener("dblclick", statementOnDblClick);
        lines[ i ].addEventListener("click", () => statementOnClick(lines[ i ]));
    }
}

function statementOnDblClick(): void
{
    document.getSelection()?.removeAllRanges();
}

function statementOnClick(line: HTMLElement): void{
    if (line.classList.contains(breakpointClass))
    {
        if (line.id === selectedCode) // Breakpoint, selected
        {
            // Remove breakpoint
            line.classList.remove(breakpointClass, "highlighted");
            line.id = "";
        }
        else // Breakpoint, not selected
        {
            // Select
            select(line);
        }
    }
    else // No breakpoint
    {
        // Add breakpoint
        line.classList.add(breakpointClass);
        // Select
        select(line);
    }

    //stops the current algorithm execution
	stopCode();

}


function select(line: HTMLElement): void
{
    const selected: HTMLElement | null = document.querySelector(selectedCode);
    line.id = selectedCode;
    removeAllHighlighting();
    highLight(parseInt(line.getAttribute("index")));

    if (selected != null) {
        selected.id = "";
    }
}