window.onload = main;

function main(): void
{
    setButtonToRun();
    initDropDown();

    const left: HTMLElement | null = document.querySelector("#left");
    const right: HTMLElement | null = document.querySelector("#right");
    if(left != null) displayCodeAsString(left, algMergeSort); 
    if(right != null) pseudocode(right);

    console.log(gcd);
    displayCodeAsString(document.querySelector("#left"), gcd);
}

function gcd(a: number, b: number): number{

    while(a != b){
        if(a > b){
            a -= b;
        }else{
            b -= a;
        }
    }

    return a;
}

