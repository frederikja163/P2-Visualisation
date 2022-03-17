function printFunction(name: string){
    name = "Jesper hansen";
    let a : number = 7;
    let b : number = 6;
    console.log(a + b);
    if (a === b){
        a++;
    } 
    const c = a+b;
}

let left = document.querySelector("#left")
let functionString : string = printFunction.toString();

let stringArray : Array<String> = functionString.split(/(?<=\{\})|[\r\n]+/);
//console.log(stringArray);

let indentArray : Array<Number> = [];
for(let i : number = 0; i<=stringArray.length ; i++){ 
    let j : number = 1;
    while (stringArray[i][j] === "a"){
        j++;  
    }
    indentArray[i] = j;
}
console.log(indentArray);
let paragraphString = stringArray.join("</p><p>");

left.innerHTML = "<pre><p>" + paragraphString + "</p></pre>";
//console.log(printFunction.toString());