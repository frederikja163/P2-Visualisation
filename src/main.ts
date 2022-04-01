window.onload = main;

function main(): void
{
    const left: HTMLElement = document.querySelector("#left");
    const right: HTMLElement = document.querySelector("#right");
    pseudocode(right);

    if(left != null) displayCodeAsString(left, algMergeSort); 
}
