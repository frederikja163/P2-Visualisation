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
    var _a;
    (_a = document.getSelection()) === null || _a === void 0 ? void 0 : _a.removeAllRanges();
}
function statementOnClick(line) {
    return __awaiter(this, void 0, void 0, function* () {
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
        yield parseCode();
    });
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
let codeFunction = null;
let isStopping = false;
let awaitingPromise = false;
let isRunning = false;
function stopCode() {
    return __awaiter(this, void 0, void 0, function* () {
        if (codeFunction != null && isRunning && awaitingPromise) {
            isStopping = true;
            resolveCurrentPromise();
            yield codeFunction();
        }
        removeAllHighlighting();
        setButtonToRun();
    });
}
function runCode() {
    return __awaiter(this, void 0, void 0, function* () {
        yield parseCode();
        currentPromise = new Promise((resolve, reject) => {
            resolveCurrentPromise = resolve;
        });
        if (codeFunction != null) {
            isStopping = false;
            isRunning = true;
            setButtonToStop();
            yield codeFunction();
            setButtonToRun();
            isRunning = false;
            isStopping = false;
        }
        removeAllHighlighting();
    });
}
function setButtonToStop() {
    const runButton = document.getElementById("runStopButton");
    if (runButton != null) {
        runButton.value = "Stop";
        runButton.onclick = stopCode;
    }
}
function setButtonToRun() {
    const runButton = document.getElementById("runStopButton");
    if (runButton != null) {
        runButton.value = "Run";
        runButton.onclick = runCode;
    }
}
function next() {
    resolveCurrentPromise();
}
function parseCode() {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        yield stopCode();
        let code = "";
        const lines = (_a = document.getElementById("code")) === null || _a === void 0 ? void 0 : _a.querySelectorAll("span");
        for (let i = 0; i < lines.length; i++) {
            let currentLine = lines[i].innerHTML.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');
            currentLine = addAwait(currentLine, lines.length, i);
            currentLine = addAsync(currentLine);
            currentLine = addBreakpoint(currentLine, lines, i);
            code += currentLine + "\n";
        }
        codeFunction = new Function('return ' + code)();
    });
}
function addAsync(currentLine) {
    let indexOfFunction = currentLine.indexOf("function");
    if (indexOfFunction != -1) {
        return currentLine.substring(0, indexOfFunction) + "async " + currentLine.substring(indexOfFunction, currentLine.length);
    }
    return currentLine;
}
function addAwait(currentLine, lineCount, lineNum) {
    const hasStartBracket = currentLine.includes("(");
    const hasEndBracket = currentLine.includes(")");
    const hasStartCurleyBracket = currentLine.includes("{");
    const hasBeginCurleyBracket = currentLine.includes("}");
    if (hasStartBracket && hasEndBracket && !hasStartCurleyBracket && !hasBeginCurleyBracket) {
        return "await " + currentLine;
    }
    return currentLine;
}
function addBreakpoint(currentLine, lines, lineNum) {
    if (lineNum == lines.length - 1) {
        return currentLine;
    }
    if (!(lines[lineNum].classList.contains(breakpointClass))) {
        return currentLine;
    }
    let hasWhile = currentLine.includes("while");
    let hasFor = currentLine.includes("for");
    let hasIf = currentLine.includes("if");
    let hasElse = currentLine.includes("else");
    let hasFunction = currentLine.includes("function");
    if (hasWhile || hasFor || hasIf) {
        let indexOfExpr = hasFor ? currentLine.indexOf(";") : currentLine.indexOf("(");
        currentLine = currentLine.substring(0, indexOfExpr + 1) + `await debug(${lineNum}) && ` + currentLine.substring(indexOfExpr + 1, currentLine.length);
    }
    else if (hasElse || hasFunction) {
        currentLine += `\nawait debug(${lineNum});`;
    }
    else {
        currentLine = `await debug(${lineNum});\n` + currentLine;
    }
    return currentLine;
}
function debug(line) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!isStopping) {
            awaitingPromise = true;
            highLight(line);
            yield currentPromise;
            removeHighLight(line);
            awaitingPromise = false;
        }
        currentPromise = new Promise((resolve, reject) => {
            resolveCurrentPromise = resolve;
        });
        return true;
    });
}
function darkMode() {
    const bodyElement = document.body;
    const darkModeBtn = document.querySelector("#darkModeBtn");
    bodyElement.classList.toggle("dark-mode");
    bodyElement.classList.contains("dark-mode") ? darkModeBtn.value = "Light Mode" :
        darkModeBtn.value = "Dark Mode";
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
        lines[i] = `${"&nbsp;".repeat(indents)}<${elementTag} index="${i}">${trimmedStr}</${elementTag}></br>`;
    }
    return lines.join("");
}
let options = document.querySelectorAll(".dropdown-content > a");
let left = document.querySelector("#left");
for (let i = 0; i < options.length; i++) {
    options[i].addEventListener("click", function dropDownSelector(event) {
        let dropdownBtn = document.querySelector(".dropdown > button");
        switch (event.target.id) {
            case "mergesort":
                if (left != null)
                    displayCodeAsString(left, algMergeSort);
                if (dropdownBtn != null)
                    dropdownBtn.innerHTML = "MergeSort";
                break;
            case "binarysearch":
                if (left != null)
                    displayCodeAsString(left, algBinarySearch);
                if (dropdownBtn != null)
                    dropdownBtn.innerHTML = "Binary Search";
                break;
            case "bubblesort":
                if (left != null)
                    displayCodeAsString(left, algBubbleSort);
                if (dropdownBtn != null)
                    dropdownBtn.innerHTML = "Bubble Sort";
                break;
        }
    });
}
function highLight(index) {
    const codeSpans = document.querySelectorAll(`span[index=\"${index}\"]`);
    for (let i = 0; i < codeSpans.length; i++) {
        codeSpans[i].classList.add("highlighted");
    }
}
function removeHighLight(index) {
    const codeSpans = document.querySelectorAll(`span[index=\"${index}\"]`);
    for (let i = 0; i < codeSpans.length; i++) {
        codeSpans[i].classList.remove("highlighted");
    }
}
function removeAllHighlighting() {
    var _a, _b;
    const lineCount = (_b = (_a = document.getElementById("code")) === null || _a === void 0 ? void 0 : _a.querySelectorAll("span")) === null || _b === void 0 ? void 0 : _b.length;
    for (let i = 0; i < lineCount; i++) {
        removeHighLight(i);
    }
}
window.onload = main;
function main() {
    setButtonToRun();
    const left = document.querySelector("#left");
    const right = document.querySelector("#right");
    if (right != null)
        pseudocode(right);
    if (left != null)
        displayCodeAsString(left, algMergeSort);
}
function pseudocode(right) {
    right.addEventListener("click", pseudocodeOnClick);
}
let oldActiveElement = null;
function pseudocodeOnClick() {
    let activeElement = document.activeElement;
    if (!(activeElement instanceof HTMLSpanElement)) {
        activeElement = document.querySelector("#right > span:last-child");
        if (activeElement != null) {
            const textContent = activeElement.textContent;
            if (textContent) {
                setCaretPosition(activeElement, textContent.length);
            }
        }
    }
    if (activeElement != oldActiveElement && oldActiveElement != null && oldActiveElement.innerHTML === "") {
        const prevElement = oldActiveElement.previousElementSibling;
        const nextElement = oldActiveElement.nextElementSibling;
        const prevIndex = prevElement === null || prevElement === void 0 ? void 0 : prevElement.getAttribute("index");
        const nextIndex = nextElement === null || nextElement === void 0 ? void 0 : nextElement.getAttribute("index");
        if (prevElement != null && nextElement != null && prevIndex === nextIndex) {
            const prevText = prevElement.textContent;
            const nextText = nextElement.textContent;
            if (prevText != null && nextText != null && prevIndex != null) {
                const mergedElement = createPseudocodeSpan(prevText + nextText, prevIndex);
                const previous = oldActiveElement.previousElementSibling;
                const next = oldActiveElement.nextElementSibling;
                if (previous != null && next != null) {
                    previous.remove();
                    next.remove();
                    oldActiveElement.replaceWith(mergedElement);
                }
            }
        }
        else {
            oldActiveElement.remove();
        }
    }
    const caretPosition = getCaretPosition();
    const selectedBreakpoint = document.querySelector("#selectedCode");
    let breakpointIndex = "-1";
    if (selectedBreakpoint != null) {
        breakpointIndex = selectedBreakpoint.getAttribute("index");
    }
    if (activeElement != null && activeElement.getAttribute("index") === breakpointIndex) {
        oldActiveElement = activeElement;
    }
    else if (activeElement != null && breakpointIndex != null) {
        splitHtmlElement(activeElement, caretPosition);
        const newElement = createPseudocodeSpan("", breakpointIndex);
        activeElement.replaceWith(newElement);
        setCaretPosition(newElement, 0);
        oldActiveElement = newElement;
    }
}
function splitHtmlElement(element, index) {
    const text = element.innerText;
    const beforeText = text.slice(0, index);
    const afterText = text.slice(index, text.length);
    const activeElementCodeIndex = element.getAttribute("index");
    if (activeElementCodeIndex != null) {
        if (beforeText === "") {
            const afterElement = createPseudocodeSpan(afterText, activeElementCodeIndex);
            element.after(afterElement);
        }
        else if (afterText === "") {
            const beforeElement = createPseudocodeSpan(beforeText, activeElementCodeIndex);
            element.before(beforeElement);
        }
        else {
            const beforeElement = createPseudocodeSpan(beforeText, activeElementCodeIndex);
            element.before(beforeElement);
            const afterElement = createPseudocodeSpan(afterText, activeElementCodeIndex);
            element.after(afterElement);
        }
    }
}
function createPseudocodeSpan(text, codeIndex) {
    const element = document.createElement("span");
    element.setAttribute("contenteditable", "true");
    element.setAttribute("index", codeIndex);
    element.innerText = text;
    return element;
}
function setCaretPosition(element, caretPos) {
    const selection = window.getSelection();
    if (selection == null)
        return;
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
    if (selection == null)
        return -1;
    selection.getRangeAt(0);
    return selection.getRangeAt(0).startOffset;
}
function algBinarySearch() {
    function binarySearch(sortedArray, key) {
        let start = 0;
        let end = sortedArray.length - 1;
        while (start <= end) {
            let middle = Math.floor((start + end) / 2);
            if (sortedArray[middle] === key) {
                return middle;
            }
            else if (sortedArray[middle] < key) {
                start = middle + 1;
            }
            else {
                end = middle - 1;
            }
        }
        return -1;
    }
    binarySearch([201, 176, 90, 63, 12, 1], 12);
}
function algBubbleSort() {
    function bubbleSort(arrary) {
        var i, j;
        var len = arrary.length;
        var isSwapped = false;
        for (i = 0; i < len; i++) {
            isSwapped = false;
            for (j = 0; j < len; j++) {
                if (arrary[j] > arrary[j + 1]) {
                    var temp = arrary[j];
                    arrary[j] = arrary[j + 1];
                    arrary[j + 1] = temp;
                    isSwapped = true;
                }
            }
            if (!isSwapped) {
                break;
            }
        }
        return arrary;
    }
    bubbleSort([243, 45, 23, 356, 3, 5346, 35, 5]);
}
function algMergeSort() {
    function mergeSort(array) {
        if (array.length <= 1) {
            return array;
        }
        const middle = Math.floor(array.length);
        const left = array.slice(0, middle);
        const right = array.slice(middle);
        return merge(mergeSort(left), mergeSort(right));
    }
    function merge(left, right) {
        const array = [];
        let lIndex = 0;
        let rIndex = 0;
        while (lIndex + rIndex < left.length + right.length) {
            const lItem = left[lIndex];
            const rItem = right[rIndex];
            if (lItem == null) {
                array.push(rItem);
                rIndex++;
            }
            else if (rItem == null) {
                array.push(lItem);
                lIndex++;
            }
            else if (lItem < rItem) {
                array.push(lItem);
                lIndex++;
            }
            else {
                array.push(rItem);
                rIndex++;
            }
        }
        return array;
    }
    mergeSort([5, 2, 3, 1, 58]);
}
//# sourceMappingURL=script.js.map