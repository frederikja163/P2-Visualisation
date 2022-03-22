var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
let currentPromise;
let resolveCurrentPromise;
function runCode() {
    const lineCount = document.querySelectorAll("p").length;
    for (let i = 0; i < lineCount; i++) {
        removeHighLight(i);
    }
    currentPromise = new Promise((resolve, reject) => {
        resolveCurrentPromise = resolve;
    });
    createBreakableCode()();
}
function next() {
    resolveCurrentPromise();
}
function createBreakableCode() {
    let code = "";
    const lines = document.querySelectorAll("p");
    for (let i = 0; i < lines.length; i++) {
        let currentLine = lines[i].innerHTML.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');
        let indexOfFunction = currentLine.indexOf("function");
        if (indexOfFunction != -1) {
            code += currentLine.substring(0, indexOfFunction) + "async " + currentLine.substring(indexOfFunction, currentLine.length) + "\n";
        }
        else {
            code += currentLine + "\n";
        }
        if (lines[i].classList.contains(breakpointClass))
            code += "await debug(" + i + ");\n";
    }
    return new Function('return ' + code)();
}
function debug(line) {
    return __awaiter(this, void 0, void 0, function* () {
        highLight(line);
        yield currentPromise;
        removeHighLight(line);
        currentPromise = new Promise((resolve, reject) => {
            resolveCurrentPromise = resolve;
        });
    });
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
    if (currParagraph != null)
        currParagraph.classList.add("highlighted");
}
function removeHighLight(index) {
    let currParagraph = document.querySelector("p[index=\"" + index + "\"]");
    if (currParagraph != null)
        currParagraph.classList.remove("highlighted");
}
window.onload = main;
function main() {
    let left = document.querySelector("#left");
    if (left != null)
        displayCodeAsString(left, f);
    breakpoint(document.body);
}
function f() {
    let sum = 0;
    for (let i = 0; i < 10; i++) {
        if (i % 2 === 0) {
            sum += i;
            console.log("I: \t" + sum);
        }
        console.log("Sum:\t" + sum);
    }
}
//# sourceMappingURL=script.js.map