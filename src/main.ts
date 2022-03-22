window.onload = main;

function main(): void
{
    let left = document.querySelector("#left");

    if(left != null) displayCodeAsString(left, f);
    breakpoint(document.body);
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