const breakpointClass: string = "breakpoint";

function breakpoint(code: Element): void
{
    const lines: NodeListOf<HTMLParagraphElement> = code.querySelectorAll("p");
    for (let i: number = 0; i < lines.length; i++)
    {
        lines[ i ].addEventListener("click", function ()
        {
            // Remove the breakpoint if it already exists, otherwise add a breakpoint.
            if (lines[ i ].classList.contains(breakpointClass))
            {
                lines[ i ].classList.remove(breakpointClass);
            } else
            {
                lines[ i ].classList.add(breakpointClass);
            }
        });
    }
}
