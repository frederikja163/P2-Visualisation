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
V Pseudocode is not highlighted
V Clicking on breakpoint algorithm lines they unbreakpointed
V All breakpoints use span 0
V Click sometimes removes breaks
V Newline sometimes removes breaks
V Does not add <br> between spans with same index
V Added <br> within spans
V Newline + Tab (adds tab to prev line)
V Tabs adds an extra space (doesnt take break tags into account)
V Right-left arrows doesn't work with breaktags
- Glitchy newlines
- Ctrl-z fux shit up
- Newline at start of the line removes the line
- A line that starts with space is removed when a newline is added after it

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