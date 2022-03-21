const breakpointClass = "breakpoint";
function breakpoint(code) {
    const lines = code.querySelectorAll("p");
    for (let i = 0; i < lines.length; i++) {
        lines[i].addEventListener("click", function () {
            if (lines[i].classList.contains(breakpointClass)) {
                lines[i].classList.remove(breakpointClass);
            }
            else {
                lines[i].classList.add(breakpointClass);
            }
        });
    }
}
function displayCodeAsString(textBox) {
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
    let functionString = printFunction.toString();
    let lines = functionString.split(/(?<=\{\})|[\r\n]+/);
    for (let i = 0; i < lines.length; i++) {
        let indents = 0;
        const currString = lines[i];
        while (currString[indents] === " ") {
            indents++;
        }
        const trimmedStr = currString.substring(indents);
        lines[i] = "&nbsp;".repeat(indents) + "<p>" + trimmedStr + "</p></br>";
    }
    const paragraphString = lines.join("");
    textBox.innerHTML = "<pre>" + paragraphString + "</pre>";
}
function highLight(input) {
    return input.replace("<p>", "<p class=\"highlighted\">");
}
function removeHighLight(input) {
    return input.replace("<p class=\"highlighted\">", "<p>");
}
window.onload = main;
function main() {
    let left = document.querySelector("#left");
    displayCodeAsString(left);
    breakpoint(document.body);
}
//# sourceMappingURL=script.js.map