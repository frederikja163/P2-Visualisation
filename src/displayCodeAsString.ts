function displayCodeAsString(textBox : Element, printFunction : Function) : void{    
    // Convert function to string.
    const functionString : string = printFunction.toString();
    // Split string into array contatining each line as separate string.
    const lines : string[] = functionString.split(/(?<=\{\})|[\r\n]+/);
    // Wrap lines of function in html elements.
    const paragraphString = wrapStrings("span", lines);
    // Display string on website.
    textBox.innerHTML = "<pre id= \"code\">" + paragraphString + "</pre>";

    initBreakpoints(textBox);
}

function wrapStrings(elementTag : string, lines : string[]) : string {
    // Iterate through each line of code, count size of indent.
    for(let i : number = 0; i < lines.length ; i++){ 
        let indents : number = 0;
        const currString : string = lines[i];

        while (currString[indents] === " "){
            indents++;
        }

        // Delete indentation from each line of code.
        const trimmedStr = currString.substring(indents);
        // Insert indentation outside of <p> tag.
        lines[i] = `${"&nbsp;".repeat(indents)}<${elementTag} index="${i}">${trimmedStr}</${elementTag}></br>`;
    }

    // Create single string from array of lines.
    return lines.join("");
}

