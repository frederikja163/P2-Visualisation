window.onload = main;

function main(): void
{
    setButtonToRun();

    const left: HTMLElement | null = document.querySelector("#left");
    const right: HTMLElement | null = document.querySelector("#right");
    if(right != null) pseudocode(right);
    if(left != null) displayCodeAsString(left, algMergeSort); 
}
