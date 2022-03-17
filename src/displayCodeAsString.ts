function printFunction(name: string){name = "Jesper hansen";
    let a : number = 7;
    let b : number = 6;
    console.log(a + b);
    if (a === b){
        a++;
    } 
    const c = a+b;
} 
let indent : number = 0;

let left = document.querySelector("#leftside")
let functionString : string = printFunction.toString();

let stringArray = functionString.split(/(?<=\{\})|[\r\n]+/);
console.log(stringArray);
let paragraphString = stringArray.join("</p><p>");

left.innerHTML = "<pre><p>" + paragraphString + "</p></pre>";
//console.log(printFunction.toString());