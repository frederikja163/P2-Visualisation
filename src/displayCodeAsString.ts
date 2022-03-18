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
let functionString = printFunction.toString();

let stringArray : Array<string> = functionString.split(/(?<=\{\})|[\r\n]+/);
console.table(stringArray);

let indentArray : Array<number> = [];
for(let i : number = 0; i < stringArray.length ; i++){ 
    let j : number = 0;
    let currString = String(stringArray[i]);
    //let currString : string = stringArray[i];
    while (currString[j] === " "){
        j++;
    }
    indentArray[i] = j;
    currString = currString.substring(indentArray[i]);
    console.log(currString);
    stringArray[i] = "&nbsp;".repeat(indentArray[i]) + "<p class= \"codeline\">" + currString + "</p></br>";
}
console.log(indentArray);
let paragraphString = stringArray.join("");


left.innerHTML = "<pre>" + paragraphString + "</pre>";
//console.log(printFunction.toString());