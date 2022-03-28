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
const selectedCode = "selectedCode";
function breakpoint(code) {
    const lines = code.querySelectorAll("span");
    for (let i = 0; i < lines.length; i++) {
        lines[i].addEventListener("dblclick", statementOnDblClick);
        lines[i].addEventListener("click", () => statementOnClick(lines[i]));
    }
}
function statementOnDblClick() {
    document.getSelection().removeAllRanges();
}
function statementOnClick(line) {
    if (line.classList.contains(breakpointClass)) {
        if (line.id === selectedCode) {
            line.classList.remove(breakpointClass);
            line.id = "";
        }
        else {
            select(line);
        }
    }
    else {
        line.classList.add(breakpointClass);
        select(line);
    }
}
function select(line) {
    const selected = document.getElementById(selectedCode);
    line.id = selectedCode;
    if (selected != null) {
        selected.id = "";
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
    let code = parseCode();
    code();
}
function next() {
    resolveCurrentPromise();
}
function parseCode() {
    let code = "";
    const lines = document.querySelectorAll("p");
    for (let i = 0; i < lines.length; i++) {
        let currentLine = lines[i].innerHTML.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');
        currentLine = addAsync(currentLine);
        currentLine = addBreakpoint(currentLine, lines, i);
        code += currentLine + "\n";
    }
    return new Function('return ' + code)();
}
function addAsync(currentLine) {
    let indexOfFunction = currentLine.indexOf("function");
    if (indexOfFunction != -1) {
        return currentLine.substring(0, indexOfFunction) + "async " + currentLine.substring(indexOfFunction, currentLine.length);
    }
    return currentLine;
}
function addBreakpoint(currentLine, lines, lineNum) {
    if (lineNum != lines.length - 1) {
        return currentLine;
    }
    if (lines[lineNum].classList.contains(breakpointClass)) {
        let indexOfDo = currentLine.indexOf("do");
        let indexOfWhile = currentLine.indexOf("while");
        let indexOfFor = currentLine.indexOf("for");
        let indexOfIf = currentLine.indexOf("if");
        let indexOfSwitch = currentLine.indexOf("switch");
        if (indexOfDo != -1 || indexOfSwitch != -1) {
            currentLine = `await debug(${lineNum});\n` + currentLine;
        }
        else if (indexOfWhile != -1 || indexOfFor != -1 || indexOfIf != -1) {
            let indexOfExpr = indexOfFor != -1 ? currentLine.indexOf(";") : currentLine.indexOf("(");
            currentLine = currentLine.substring(0, indexOfExpr + 1) + `await debug(${lineNum}) && ` + currentLine.substring(indexOfExpr + 1, currentLine.length);
        }
        else {
            currentLine += `\nawait debug(${lineNum});`;
        }
    }
    return currentLine;
}
function debug(line) {
    return __awaiter(this, void 0, void 0, function* () {
        highLight(line);
        yield currentPromise;
        removeHighLight(line);
        currentPromise = new Promise((resolve, reject) => {
            resolveCurrentPromise = resolve;
        });
        return true;
    });
}
function displayCodeAsString(textBox, printFunction) {
    let functionString = printFunction.toString();
    const paragraphString = wrapStrings("span", functionString);
    textBox.innerHTML = "<pre id= \"code\">" + paragraphString + "</pre>";
    breakpoint(textBox);
}
function wrapStrings(elementTag, functionString) {
    let lines = functionString.split(/(?<=\{\})|[\r\n]+/);
    for (let i = 0; i < lines.length; i++) {
        let indents = 0;
        const currString = lines[i];
        while (currString[indents] === " ") {
            indents++;
        }
        const trimmedStr = currString.substring(indents);
        lines[i] = `${"&nbsp;".repeat(indents)}<${elementTag} index="${i}"> ${trimmedStr}</${elementTag}></br>`;
    }
    return lines.join("");
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
    const left = document.querySelector("#left");
    const right = document.querySelector("#right");
    pseudocode(right);
    if (left != null)
        displayCodeAsString(left, f);
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
function pseudocode(right) {
    setCaretPosition(document.querySelector("span"), 0);
    right.addEventListener("input", pseudocodeOnInput);
    right.addEventListener("click", pseudocodeOnClick);
}
function pseudocodeOnInput(ev) {
    const pseudocode = ev.target;
    const text = ev.data;
}
let oldActiveElement = null;
function pseudocodeOnClick() {
    let activeElement = document.activeElement;
    if (!(activeElement instanceof HTMLSpanElement)) {
        activeElement = document.querySelector("#right > span:last-child");
    }
    if (activeElement != oldActiveElement && oldActiveElement != null) {
        if (oldActiveElement.textContent === "") {
            oldActiveElement.remove();
        }
    }
    const text = activeElement.textContent;
    const caretPosition = getCaretPosition();
    const beforeCursor = text.slice(0, caretPosition);
    const afterCursor = text.slice(caretPosition, text.length);
    if (beforeCursor === "") {
        activeElement.after(createPseudocodeSpan(afterCursor));
    }
    else if (afterCursor === "") {
        activeElement.before(createPseudocodeSpan(beforeCursor));
    }
    else {
        activeElement.before(createPseudocodeSpan(beforeCursor));
        activeElement.after(createPseudocodeSpan(afterCursor));
    }
    const newElement = createPseudocodeSpan("");
    activeElement.replaceWith(newElement);
    setCaretPosition(newElement, 0);
    oldActiveElement = newElement;
}
function createPseudocodeSpan(text) {
    const element = document.createElement("span");
    element.setAttribute("contenteditable", "true");
    element.innerText = text;
    return element;
}
function setCaretPosition(element, caretPos) {
    const selection = window.getSelection();
    const range = document.createRange();
    selection.removeAllRanges();
    range.selectNodeContents(element);
    range.collapse(false);
    range.setStart(element, caretPos);
    range.setEnd(element, caretPos);
    selection.addRange(range);
    element.focus();
}
function getCaretPosition() {
    const selection = window.getSelection();
    selection.getRangeAt(0);
    return selection.getRangeAt(0).startOffset;
}
//# sourceMappingURL=script.js.map