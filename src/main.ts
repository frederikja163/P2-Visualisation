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
Fix af arrows
top fil komentar (2 -  3 komentar til filer)
funktions komentar (omhandlende input og output)
Ingen var, const når det er muligt
Variabel typer
Fjern temp kode inkl. udkomenteret kode
Quarry selector
CSS (kommentar, inkl. opsætning)
Typescript filopdeling (Logisk mening med hvad filerne de heder og gør)
logik ændringer
read me (overordnet)
- hvordan man compiler
read me (src) 
*/