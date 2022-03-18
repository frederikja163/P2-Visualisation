// function that should be printed
function printFunction(name: string){
    name = "Jesper hansen";
    let a : number = 7;
    let b : number = 6;
    console.log(a + b);
    if (a === b){
        a++;
    } 
    const c = a + b;
}
// convert function to string
let functionString : string = printFunction.toString();
// split string into array contatining each line as separate string
let stringArray : Array<string> = functionString.split(/(?<=\{\})|[\r\n]+/);
// iterate though each line of code, count size of indent
let indentArray : Array<number> = [];
for(let i : number = 0; i < stringArray.length ; i++){ 
    let j : number = 0;
    let currString : string = String(stringArray[i]);
    while (currString[j] === " "){
        j++;
    }
    indentArray[i] = j;
    // delete indentation from each line of code
    currString = currString.substring(indentArray[i]);

    // insert indentation outside of <p> tag
    stringArray[i] = "&nbsp;".repeat(indentArray[i]) + "<p>" + currString + "</p></br>";
}
// create single string from array of lines
let paragraphString = stringArray.join("");
// display string on website

let left = document.querySelector("#left")
left.innerHTML = "<pre>" + paragraphString + "</pre>";