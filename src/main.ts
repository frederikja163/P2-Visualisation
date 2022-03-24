window.onload = main;

function main(): void
{
    const left: HTMLElement = document.querySelector("#left");
    const right: HTMLElement = document.querySelector("#right");
    pseudocode(right);

    if(left != null) displayCodeAsString(left, f);
}

function f() {
    let sum = 0;
    for(let i = 0; i < 10; i++){
        if(i % 2 === 0){
            sum += i;
            console.log("I: \t" + sum);
        }
        console.log("Sum:\t" + sum);
    }
}