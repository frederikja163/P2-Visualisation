window.onload = main;

function main(): void
{
    setButtonToRun();
    initDropDown();

    const left: HTMLElement | null = document.querySelector("#left");
    const right: HTMLElement | null = document.querySelector("#right");
    if(left != null) displayCodeAsString(left, algMergeSort); 
    if(right != null) pseudocode(right);
}
