function displayCodeAsString(textBox: Element, printFunction: Function): void {
    // Convert function to string.
    const functionString: string = printFunction.toString();
    // Split string into array contatining each line as separate string.
    const lines: string[] = functionString.split(/(?<=\{\})|[\r\n]+/);
    // Wrap lines of function in html elements.
    const paragraphString: string = wrapStrings("span", lines);
    // Display string on website.
    textBox.innerHTML = "<pre id= \"code\">" + paragraphString + "</pre>";

    initBreakpoints();
}

function wrapStrings(elementTag: string, lines: string[]): string {
    // Iterate through each line of code, count size of indent
    for (let i: number = 0; i < lines.length; i++) {
        let indents: number = 0;
        const currString: string = lines[i];

        while (currString[indents] === " ") {
            indents++;
        }

        // Delete indentation from each line of code.
        const trimmedStr: string = currString.substring(indents);
        // Insert indentation outside of <p> tag.
        lines[i] = `${"&nbsp;".repeat(indents)}<${elementTag} index="${i}">${trimmedStr}</${elementTag}></br>`;
    }

    //Syntax highlight. To add another word/color, simply add another element to highlight.
    type Highlight = { word: string, color: string };
    const highlight: Highlight[] = [
        { word: "for", color: "#F13269" },
        { word: "let", color: "#0EC86B" },
        { word: "if", color: "#499CFF" },
        { word: "console.log", color: "magenta" },
        { word: "function", color: "#F13269" },
        { word: "switch", color: "#9D57CB" },
        { word: "while", color: "#9D57CB" },
        { word: "return", color: "#9D57CB" },
        { word: "const", color: "#0EC86B" },
        { word: "else", color: "#499CFF" },
        { word: "var", color: "#0EC86B" },
    ];

    for (let i: number = 0; i < lines.length; i++) {
        for (let k: number = 0; k < highlight.length; k++) {
            if (lines[i].includes(highlight[k].word)) {
                lines[i] = lines[i].replace(highlight[k].word, `<span style="color: ${highlight[k].color};">${highlight[k].word}</span>`);
            }
        }
    }
    // create single string from array of lines
    return lines.join("");
}

