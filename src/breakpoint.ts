const breakpointClass: string = "breakpoint";

/*
<p class="breakpoint" selected="true" index="7" pseudo="4">

<p selected="true" index="4" code="7">
*/

function breakpoint(code: Element): void
{
    const lines: NodeListOf<HTMLParagraphElement> = code.querySelectorAll("p");
    for (let i: number = 0; i < lines.length; i++)
    {
        lines[ i ].addEventListener("dblclick", statementOnDblClick);
        lines[ i ].addEventListener("click", () => statementOnClick(lines[ i ]));
    }
}

function statementOnDblClick(): void
{
    document.getSelection().removeAllRanges();
}

function statementOnClick(line: HTMLElement): void
{
    if (line.classList.contains(breakpointClass))
    {
        if (line.id === "selected") // Breakpoint, selected
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
}


function select(line: HTMLElement): void
{
    const selected: HTMLElement = document.getElementById("selected");
    line.id = "selected";
    selected.id = "";
}