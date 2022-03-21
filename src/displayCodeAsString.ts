function displayCodeAsString(textBox : Element){    
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
        lines[i] = "&nbsp;".repeat(indents) + "<p>" + trimmedStr + "</p></br>";
    }

    //lines[1] = highLight(lines[1]);

    // create single string from array of lines
    const paragraphString = lines.join("");
    // display string on website

    textBox.innerHTML = "<pre>" + paragraphString + "</pre>";
}

function highLight(input : string){
    return input.replace("<p>", "<p class=\"highlighted\">");
}
function removeHighLight(input : string){
    return input.replace("<p class=\"highlighted\">", "<p>");
}