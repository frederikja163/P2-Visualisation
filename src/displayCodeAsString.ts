function displayCodeAsString(textBox : Element, printFunction : Function) : void{    
    // convert function to string
    let functionString : string = printFunction.toString();
    // wrap lines of function in html elements
    const paragraphString = wrapStrings("span", functionString);
    // display string on website
    textBox.innerHTML = "<pre id= \"code\">" + paragraphString + "</pre>";
}

function wrapStrings(elementTag : string, functionString : string) : string {
    // split string into array containing each line as separate string
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
        lines[i] = `${"&nbsp;".repeat(indents)}<${elementTag} index="${i}"> ${trimmedStr}</${elementTag}></br>`;
    }
    

    //Each word correlates to a color. 
    //To change color, find the index of the word below, 
    //and change index position in color.
    // i.e. word[3] is console.log, corresponding color is color[3] which is magenta.
    let word : string[] = ['for', 'let', 'if', 'console.log', 'function', 'switch', 'while', 'do'];
    let color : string[] = ['red', 'green', 'blue', 'magenta', 'gray', 'red', 'red', 'red',];
    for(let i : number = 0; i < lines.length; i++){
        for(let k : number = 0; k < word.length; k++)
            if(lines[i].includes(word[k])){
                lines[i] = lines[i].replace(word[k],`<span style="color: ${color[k]};">${word[k]}</span>`);
            }
    }

    // create single string from array of lines
    return lines.join("");
}

