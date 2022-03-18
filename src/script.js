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
let stringArray = functionString.split(/(?<=\{\})|[\r\n]+/);
let indentArray = [];
for (let i = 0; i < stringArray.length; i++) {
    let j = 0;
    let currString = String(stringArray[i]);
    while (currString[j] === " ") {
        j++;
    }
    indentArray[i] = j;
    currString = currString.substring(indentArray[i]);
    stringArray[i] = "&nbsp;".repeat(indentArray[i]) + "<p>" + currString + "</p></br>";
}
let paragraphString = stringArray.join("");
let left = document.querySelector("#left");
left.innerHTML = "<pre>" + paragraphString + "</pre>";
window.onload = main;
function main() {
    breakpoint(document.body);
}
//# sourceMappingURL=script.js.map