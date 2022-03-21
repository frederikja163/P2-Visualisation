function displayCodeAsString(textBox : Element, printFunction : Function) : void{    
    // convert function to string
    let functionString : string = printFunction.toString();
    // split string into array contatining each line as separate string
    let lines : string[] = functionString.split(/(?<=\{\})|[\r\n]+/);
    // iterate though each line of code, count size of indent

    for(let i : number = 0; i < lines.length ; i++){ 
        let indents : number = 0;
        const currString : string = lines[i];

        while (currString[indents] === " "){
            indents++;
        }

        // delete indentation from each line of code
        const trimmedStr = currString.substring(indents);
        // insert indentation outside of <p> tag
        lines[i] = "&nbsp;".repeat(indents) + "<p index=\""+ i + "\">" + trimmedStr + "</p></br>";
    }

    // create single string from array of lines
    const paragraphString = lines.join("");

    // display string on website
    textBox.innerHTML = "<pre id= \"code\">" + paragraphString + "</pre>";
}

