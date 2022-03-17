const lines: NodeListOf<HTMLParagraphElement> = document.querySelectorAll('p');

for (let i: number = 0; i < lines.length; i++)
{
    lines[ i ].addEventListener("click", function ()
    {
        // Remove the breakpoint if it already exists, otherwise add a breakpoint.
        if (lines[ i ].classList.contains('breakpoint'))
        {
            lines[ i ].classList.remove('breakpoint');
        }
        else
        {
            lines[ i ].classList.add('breakpoint');
        }
    });
}
