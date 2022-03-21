window.onload = main;

function main(): void
{
    let left = document.querySelector("#left");

    displayCodeAsString(left, printFunction);
    breakpoint(document.body);
}

// function that should be printed
function printFunction(name: string) : void{
    name = "Jesper hansen";
    let a : number = 7;
    let b : number = 6;
    console.log(a + b);
    if (a === b){
        a++;
    } 
    const c = a + b;
}