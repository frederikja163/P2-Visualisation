const breakpointClass: string = "breakpoint";
const selectedCode: string = "selectedCode";

function breakpoint(code: Element): void
{
    const lines: NodeListOf<HTMLSpanElement> = code.querySelectorAll("span");
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
            line.classList.remove(breakpointClass);
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
    
    //reconstructs the code
    parseCode(); 
    
}


function select(line: HTMLElement): void
{
    const selected: HTMLElement | null = document.getElementById(selectedCode);
    line.id = selectedCode;
    if (selected != null) {
        selected.id = "";
    }
}