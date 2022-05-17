window.onload = main;

function main(): void {
    setButtonToRun();
    initDropDown();

    const left: HTMLElement | null = document.querySelector("#left");
    const right: HTMLElement | null = document.querySelector("#right");
    if (left != null) displayCodeAsString(left, algMergeSort);
    if (right != null) pseudocode(right);

    //displayCodeAsString(document.querySelector("#left"), null);
}

/*
COMMITS
V Fix problems (including arrows)
V logik ændringer
V Quarry selector
X Ingen var, const når det er muligt
- Variabel typer
- indre funktions komentar (ift. logik)
- ydre funktions komentar (omhandlende input og output)
- Typescript filopdeling (Logisk mening med hvad filerne de heder og gør)
- Fjern temp kode inkl. udkomenteret kode
- top fil komentar (2 -  3 komentar til filer)
- CSS (kommentar, inkl. opsætning)
- read me (src) 
- read me (overordnet)
    - hvordan man compiler
*/