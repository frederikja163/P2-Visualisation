const breakpointClass = "breakpoint";
function breakpoint(code) {
    const lines = code.querySelectorAll("p");
    for (let i = 0; i < lines.length; i++) {
        lines[i].addEventListener("click", function () {
            if (lines[i].classList.contains(breakpointClass)) {
                lines[i].classList.remove(breakpointClass);
                lines[i].classList.remove("highlighted");
            }
            else {
                lines[i].classList.add(breakpointClass);
                lines[i].classList.add("highlighted");
            }
        });
    }
}
function displayCodeAsString(textBox, printFunction) {
    let functionString = printFunction.toString();
    let lines = functionString.split(/(?<=\{\})|[\r\n]+/);
    for (let i = 0; i < lines.length; i++) {
        let indents = 0;
        const currString = lines[i];
        while (currString[indents] === " ") {
            indents++;
        }
        const trimmedStr = currString.substring(indents);
        lines[i] = "&nbsp;".repeat(indents) + "<p index=\"" + i + "\">" + trimmedStr + "</p></br>";
    }
    const paragraphString = lines.join("");
    textBox.innerHTML = "<pre id= \"code\">" + paragraphString + "</pre>";
}
function highLight(index) {
    let currParagraph = document.querySelector("p[index=\"" + index + "\"]");
    currParagraph.classList.add("highlighted");
}
function removeHighLight(index) {
    let currParagraph = document.querySelector("p[index=\"" + index + "\"]");
    currParagraph.classList.remove("highlighted");
}
window.onload = main;
function main() {
    function printFunction(name) {
        name = "Jesper hansen";
        let a = 7;
        let b = 6;
        console.log(a + b);
        if (a === b) {
            a++;
        }
        const c = a + b;
    }
    let left = document.querySelector("#left");
    displayCodeAsString(left, printFunction);
    breakpoint(document.body);
}
//# sourceMappingURL=script.js.map