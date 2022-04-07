function displayCodeAsString(textBox : Element, printFunction : Function) : void{    
    // Convert function to string
    let functionString : string = printFunction.toString();
    // Wrap lines of function in html elements
    const paragraphString = wrapStrings("span", functionString);
    // Display string on website
    textBox.innerHTML = "<pre id= \"code\">" + paragraphString + "</pre>";

    breakpoint(textBox);
}

function wrapStrings(elementTag : string, functionString : string) : string {
    let lines : string[] = functionString.split(/(?<=\{\})|[\r\n]+/);
    // Iterate through each line of code, count size of indent

    for(let i : number = 0; i < lines.length ; i++){ 
        let indents : number = 0;
        const currString : string = lines[i];

        while (currString[indents] === " "){
            indents++;
        }

        // Delete indentation from each line of code
        const trimmedStr = currString.substring(indents);
        // Insert indentation outside of <p> tag
        lines[i] = `${"&nbsp;".repeat(indents)}<${elementTag} index="${i}">${trimmedStr}</${elementTag}></br>`;
    }

    //Syntax highlight. To add another word/color, simply add another element to highlight.
    type Highlight = {word: string, color : string};
    const highlight: Highlight[] = [
    {word : "for", color : "red"}, 
    {word : "let", color : "green"}, 
    {word : "if", color : "blue"}, 
    {word : "console.log", color : "magenta"}, 
    {word : "function", color : "gray"}, 
    {word : "switch", color : "red"}, 
    {word : "while", color : "red"}, 
    {word : "do", color : "red"}];
      
    for(let i : number = 0; i < lines.length; i++){
        for(let k : number = 0; k < highlight.length; k++){
            if(lines[i].includes(highlight[k].word)){   
                lines[i] = lines[i].replace(highlight[k].word,`<span style="color: ${highlight[k].color};">${highlight[k].word}</span>`);
            }
        }
    }
    // create single string from array of lines
    return lines.join("");
}

