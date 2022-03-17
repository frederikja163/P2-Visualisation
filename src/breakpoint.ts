const breakpointClass: string = "breakpoint";

/*
 1. No underline (no breakpoint)
 2. Underline, not selected (black underline)
 3. Underline, selected (red underline)


 #1 -> 3, #(old 3 -> 2)
 #2 -> 3, (old 3 -> 2)
 #3 -> 1

*/

function breakpoint(code: Element): void
{
    const lines: NodeListOf<HTMLParagraphElement> = code.querySelectorAll("p");
    for (let i: number = 0; i < lines.length; i++)
    {
        lines[ i ].addEventListener("dblclick", function (ev: MouseEvent)
        {
            document.getSelection().removeAllRanges();
        });

        lines[ i ].addEventListener("click", function ()
        {
            const selected: HTMLElement = document.getElementById("selected");

            if (!(lines[ i ].classList.contains(breakpointClass))) // No underline
            {
                lines[ i ].classList.add(breakpointClass);
                lines[ i ].id = "selected";

                selected.id = "";
            }
            else if (lines[ i ].classList.contains(breakpointClass) && lines[ i ].id === "") // Underline, not selected
            {
                lines[ i ].id = "selected";
                selected.id = "";
            }
            else if (lines[ i ].classList.contains(breakpointClass) && lines[ i ].id === "selected") // Underline, selected
            {
                lines[ i ].classList.remove(breakpointClass);
                lines[ i ].id = "";
            }
        });
    }
}
