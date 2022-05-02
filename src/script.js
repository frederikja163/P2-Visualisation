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
function initBreakpoints() {
    const lines = document.querySelectorAll("#code > span");
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
    if (line.classList.contains(breakpointClass)) {
        if (line.id === selectedCode) {
            line.classList.remove(breakpointClass, "highlighted");
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
    stopCode();
}
function select(line) {
    const selected = document.getElementById(selectedCode);
    line.id = selectedCode;
    highLight(parseInt(line.getAttribute("index")));
    if (selected != null) {
        removeHighLight(parseInt(selected.getAttribute("index")));
        selected.id = "";
    }
}
let currentPromise;
let resolveCurrentPromise;
let isStopping = false;
function stopCode() {
    if (resolveCurrentPromise != null) {
        isStopping = true;
        resolveCurrentPromise();
    }
}
function runCode() {
    document.querySelector("#selectedCode").id = "";
    currentPromise = new Promise((resolve) => {
        resolveCurrentPromise = resolve;
    });
    isStopping = false;
    removeAllHighlighting();
    setButtonToStop();
    runParsedCode().then(() => setButtonToRun());
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
function runParsedCode() {
    let code = "";
    const lineElements = document.querySelectorAll("#code > span");
    const lines = [];
    for (let i = 0; i < lineElements.length; i++) {
        lines[i] = lineElements[i].innerText.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');
    }
    const functionNames = getFunctionNames(lines);
    for (let i = 0; i < lines.length; i++) {
        let currentLine = lines[i];
        currentLine = addAsyncAwait(currentLine, functionNames);
        currentLine = addBreakpoint(currentLine, lineElements, i);
        code += currentLine + "\n";
    }
    const codeFunction = new Function('return ' + code)();
    return codeFunction();
}
function getFunctionNames(lines) {
    const functionNames = [];
    for (let i = 0; i < lines.length; i++) {
        const currentLine = lines[i];
        const indexOfFunction = currentLine.indexOf("function");
        if (indexOfFunction != -1) {
            functionNames.push(currentLine.substring(indexOfFunction + "function".length + 1, currentLine.indexOf("(")));
        }
    }
    return functionNames;
}
function addAsyncAwait(currentLine, functionNames) {
    const indexOfFunction = currentLine.indexOf("function");
    if (indexOfFunction != -1) {
        return currentLine.substring(0, indexOfFunction) + "async " + currentLine.substring(indexOfFunction, currentLine.length);
    }
    else {
        for (let i = 0; i < functionNames.length; i++) {
            const indexOfFunction = currentLine.indexOf(functionNames[i]);
            if (indexOfFunction != -1) {
                return currentLine.substring(0, indexOfFunction) + "await " + currentLine.substring(indexOfFunction, currentLine.length);
            }
        }
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
    const hasWhile = currentLine.includes("while");
    const hasFor = currentLine.includes("for");
    const hasIf = currentLine.includes("if");
    const hasElse = currentLine.includes("else");
    const hasFunction = currentLine.includes("function");
    if (hasWhile || hasFor || hasIf) {
        const indexOfExpr = hasFor ? currentLine.indexOf(";") : currentLine.indexOf("(");
        currentLine = currentLine.substring(0, indexOfExpr + 1) + `await breakpoint(${lineNum}) && ` + currentLine.substring(indexOfExpr + 1, currentLine.length);
    }
    else if (hasElse || hasFunction) {
        currentLine += `\nawait breakpoint(${lineNum});`;
    }
    else {
        currentLine = `await breakpoint(${lineNum});\n` + currentLine;
    }
    return currentLine;
}
function breakpoint(line) {
    return __awaiter(this, void 0, void 0, function* () {
        if (isStopping)
            return true;
        highLight(line);
        yield currentPromise;
        removeHighLight(line);
        currentPromise = new Promise((resolve) => {
            resolveCurrentPromise = resolve;
        });
        return true;
    });
}
function darkMode() {
    const bodyElement = document.body;
    const darkModeBtn = document.querySelector("#darkModeBtn");
    bodyElement.classList.toggle("dark-mode");
    darkModeBtn.value = bodyElement.classList.contains("dark-mode") ? "Light Mode" :
        "Dark Mode";
}
function displayCodeAsString(textBox, printFunction) {
    const functionString = printFunction.toString();
    const lines = functionString.split(/(?<=\{\})|[\r\n]+/);
    const paragraphString = wrapStrings("span", lines);
    textBox.innerHTML = "<pre id= \"code\">" + paragraphString + "</pre>";
    initBreakpoints();
}
function wrapStrings(elementTag, lines) {
    for (let i = 0; i < lines.length; i++) {
        let indents = 0;
        const currString = lines[i];
        while (currString[indents] === " ") {
            indents++;
        }
        const trimmedStr = currString.substring(indents);
        lines[i] = `${"&nbsp;".repeat(indents)}<${elementTag} index="${i}">${trimmedStr}</${elementTag}></br>`;
    }
    const highlight = [
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
    for (let i = 0; i < lines.length; i++) {
        for (let k = 0; k < highlight.length; k++) {
            if (lines[i].includes(highlight[k].word)) {
                lines[i] = lines[i].replace(highlight[k].word, `<span style="color: ${highlight[k].color};">${highlight[k].word}</span>`);
            }
        }
    }
    return lines.join("");
}
function initDropDown() {
    const left = document.querySelector("#left");
    const dropdownBtn = document.querySelector(".dropbtn");
    const dropdownContent = document.querySelector(".dropdown-content");
    let optionContent, option;
    for (let i = 0; i < algorithmList.length; i++) {
        option = document.createElement("a");
        optionContent = document.createTextNode(algorithmList[i].name);
        option.appendChild(optionContent);
        dropdownContent.appendChild(option);
        dropdownContent.children[i].addEventListener("click", function () {
            displayCodeAsString(left, algorithmList[i].fnc);
            dropdownBtn.innerHTML = algorithmList[i].name;
        });
    }
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
    initDropDown();
    const left = document.querySelector("#left");
    const right = document.querySelector("#right");
    if (left != null)
        displayCodeAsString(left, algMergeSort);
    if (right != null)
        pseudocode(right);
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
        newElement.classList.add("highlighted");
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
let algorithmList = [
    {
        name: "MergeSort",
        fnc: algMergeSort,
    },
    {
        name: "Euclid (GCD)",
        fnc: algGCD
    },
    {
        name: "Bubblesort",
        fnc: algBubbleSort
    },
    {
        name: "Binary Search",
        fnc: algBinarySearch
    }
];
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
    binarySearch([420, 336, 201, 176, 101, 98, 90, 69, 63, 43, 12, 1], 69);
}
function algBubbleSort() {
    function bubbleSort(array) {
        var i, j;
        var len = array.length;
        var isSwapped = false;
        for (i = 0; i < len; i++) {
            isSwapped = false;
            for (j = 0; j < len; j++) {
                if (array[j] > array[j + 1]) {
                    var temp = array[j];
                    array[j] = array[j + 1];
                    array[j + 1] = temp;
                    isSwapped = true;
                }
            }
            if (!isSwapped) {
                break;
            }
        }
        return array;
    }
    bubbleSort([243, 45, 23, 356, 3, 5346, 35, 5]);
}
function algGCD() {
    function gcd(a, b) {
        while (a !== b) {
            if (a > b) {
                a -= b;
            }
            else {
                b -= a;
            }
        }
        return a;
    }
    gcd(48, 18);
}
function algMergeSort() {
    function mergeSort(array) {
        if (array.length <= 1) {
            return array;
        }
        const middle = Math.floor(array.length / 2);
        const left = array.slice(0, middle);
        const right = array.slice(middle);
        const sortedLeft = mergeSort(left);
        const sortedRight = mergeSort(right);
        return merge(sortedLeft, sortedRight);
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