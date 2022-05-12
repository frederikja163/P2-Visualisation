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

Fix Arrows (Problems)
- Newline + Tab (adds tab to prev line)
- Tabs adds an extra space (doesnt take break tags into account)
V Pseudocode is not highlighted
V Clicking on breakpoint algorithm lines they unbreakpointed
V All breakpoints use span 0
- Click sometimes removes breaks
- Newline sometimes removes breaks
- Ctrl-z fux shit up
- Right-left arrows doesn't work with breakpoints
- Does not add <br> between spans with same index

COMMITS
Fix prbolems (including arrows)
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