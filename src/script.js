const breakpointClass = "breakpoint";
const selectedCode = "selectedCode";
function initBreakpoints() {
    const lines = document.querySelectorAll("#code > span");
    for (let i = 0; i < lines.length; i++) {
        if (!lines[i].hasAttribute('index'))
            continue;
        lines[i].addEventListener("dblclick", statementOnDblClick);
        lines[i].addEventListener("click", () => statementOnClick(lines[i]));
    }
}
function statementOnDblClick() {
    document.getSelection()?.removeAllRanges();
}
function statementOnClick(line) {
    stopCode();
    removeAllHighlighting();
    if (line.id === selectedCode) {
        line.id = "";
        if (line.classList.contains(breakpointClass))
            line.classList.remove(breakpointClass);
        return;
    }
    if (!line.classList.contains(breakpointClass)) {
        line.classList.add(breakpointClass);
    }
    const selected = document.querySelector(`#${selectedCode}`);
    line.id = selectedCode;
    highLight(parseInt(line.getAttribute("index")));
    if (selected != null) {
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
    const selected = document.querySelector("#selectedCode");
    if (selected != null) {
        selected.id = "";
    }
    currentPromise = new Promise((resolve) => {
        resolveCurrentPromise = resolve;
    });
    isStopping = false;
    removeAllHighlighting();
    setButtonToStop();
    runParsedCode().then(() => setButtonToRun());
}
function setButtonToStop() {
    const runButton = document.querySelector("#runStopButton");
    if (runButton != null) {
        runButton.value = "Stop";
        runButton.onclick = stopCode;
    }
}
function setButtonToRun() {
    const runButton = document.querySelector("#runStopButton");
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
async function breakpoint(line) {
    if (isStopping)
        return true;
    highLight(line);
    await currentPromise;
    removeHighLight(line);
    currentPromise = new Promise((resolve) => {
        resolveCurrentPromise = resolve;
    });
    return true;
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
    const lineCount = document.querySelectorAll("#code > span")?.length;
    for (let i = -1; i < lineCount; i++) {
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
    right.addEventListener("keyup", pseudocodeOnKeyPress);
    right.addEventListener("click", pseudocodeOnClick);
    right.addEventListener('keydown', pseudocodeOnTab);
    right.addEventListener("keydown", fixDelete);
    right.addEventListener("keydown", fixArrows);
    right.addEventListener("keydown", fixCtrlZ);
}
function fixDelete(eventParameters) {
    const caret = getCaretPosition();
    const activeElement = document.activeElement;
    let adjElement;
    let adjAdjElement = null;
    let adjIsRight;
    if (eventParameters.key === "Backspace" && caret === 0) {
        adjElement = activeElement.previousElementSibling;
        if (adjElement != null) {
            adjAdjElement = adjElement.previousElementSibling;
            adjElement.innerText = adjElement.innerText.slice(0, adjElement.innerText.length - 1);
        }
        adjIsRight = false;
    }
    else if (eventParameters.key === "Delete" && caret === activeElement.innerText.length) {
        adjElement = activeElement.nextElementSibling;
        if (adjElement != null) {
            adjAdjElement = adjElement.nextElementSibling;
            adjElement.innerText = adjElement.innerText.slice(1, adjElement.innerText.length);
        }
        adjIsRight = true;
    }
    if (adjAdjElement != null && adjElement.innerText.length === 0 && adjAdjElement.getAttribute("index") === activeElement.getAttribute("index")) {
        setCaretPosition(adjAdjElement, adjIsRight ? 0 : adjAdjElement.innerText.length);
        oldActiveElement = adjAdjElement;
        eventParameters.preventDefault();
    }
    if (adjElement != null && adjElement.innerText.length == 0)
        adjElement.remove();
    let mergedElement = null;
    const newActiveElement = document.activeElement;
    if (newActiveElement.nextElementSibling != null && newActiveElement.nextElementSibling.getAttribute("index") === newActiveElement.getAttribute("index")) {
        const sibSize = newActiveElement.innerText.length;
        mergedElement = mergeElements(newActiveElement, newActiveElement.nextElementSibling);
        setCaretPosition(mergedElement, sibSize);
    }
    else if (newActiveElement.previousElementSibling != null && newActiveElement.previousElementSibling.getAttribute("index") === newActiveElement.getAttribute("index")) {
        const sibSize = newActiveElement.previousElementSibling.innerText.length;
        mergedElement = mergeElements(newActiveElement.previousElementSibling, newActiveElement);
        setCaretPosition(mergedElement, sibSize);
    }
    if (mergedElement !== null && newActiveElement.classList.contains("highlighted"))
        mergedElement.classList.add("highlighted");
}
function fixArrows(eventParameters) {
    let direction = eventParameters.key === "ArrowLeft" ? -1 : (eventParameters.key === "ArrowRight" ? +1 : 0);
    let caretPosition = getCaretPosition();
    const activeElement = document.activeElement;
    if (direction === 0 || (direction < 0 ? caretPosition != 0 : caretPosition != activeElement.innerHTML.length))
        return;
    eventParameters.preventDefault();
    const index = activeElement.getAttribute("index");
    let adjElement = (direction < 0 ?
        activeElement.previousElementSibling :
        activeElement.nextElementSibling);
    if (adjElement === null)
        return;
    if (activeElement.innerHTML != "") {
        const newElement = createPseudocodeSpan("", index == null ? "" : index);
        newElement.classList.add("highlighted");
        if (adjElement.tagName !== "SPAN") {
            adjElement = (direction < 0 ? (adjElement.previousElementSibling) : adjElement.nextElementSibling);
            if (direction < 0)
                adjElement.after(newElement);
            else
                adjElement.before(newElement);
        }
        else {
            insertPseudocodeSpan(newElement, adjElement, direction < 0 ? adjElement.innerText.length - 1 : 1);
        }
        setCaretPosition(newElement, 0);
        oldActiveElement = newElement;
        return;
    }
    const adjadjElement = (direction < 0 ?
        adjElement.previousElementSibling :
        adjElement.nextElementSibling);
    const behindElement = (direction < 0 ?
        activeElement.nextElementSibling :
        activeElement.previousElementSibling);
    if ((adjElement.tagName !== "SPAN" || adjElement.innerHTML.length == 1) && adjadjElement != null &&
        adjadjElement.tagName === "SPAN" && adjadjElement.getAttribute("index") === index) {
        if (behindElement != null && behindElement.tagName === "SPAN" && adjElement.tagName === "SPAN") {
            if (direction < 0)
                mergeElements(adjElement, behindElement);
            else
                mergeElements(behindElement, adjElement);
            activeElement.remove();
        }
        setCaretPosition(adjadjElement, direction < 0 ? adjadjElement.innerHTML.length : 0);
        oldActiveElement = adjadjElement;
        return;
    }
    if (adjElement.tagName !== "SPAN") {
        adjElement.remove();
        const br = document.createElement("br");
        if (direction < 0) {
            if (behindElement !== null && behindElement.tagName !== "SPAN") {
                activeElement.after(br, createPseudocodeSpan("", index));
            }
            else {
                activeElement.after(br);
            }
        }
        else {
            if (behindElement !== null && behindElement.tagName !== "SPAN") {
                activeElement.before(createPseudocodeSpan("", index), br);
            }
            else {
                activeElement.before(br);
            }
        }
        const adjElementNext = document.activeElement.nextElementSibling;
        const adjElementPrev = document.activeElement.previousElementSibling;
        const activeElementIndex = document.activeElement.getAttribute("index");
        if (adjElementNext != null && adjElementNext.getAttribute("index") != null && adjElementNext.getAttribute("index") !== activeElementIndex && adjElementNext.innerHTML === "")
            adjElementNext.remove();
        if (adjElementPrev != null && adjElementPrev.getAttribute("index") != null && adjElementPrev.getAttribute("index") !== activeElementIndex && adjElementPrev.innerHTML === "")
            adjElementPrev.remove();
        return;
    }
    const adjChar = adjElement.innerHTML.charAt(direction < 0 ? adjElement.innerHTML.length - 1 : 0);
    adjElement.innerHTML = direction < 0 ?
        adjElement.innerHTML.slice(0, adjElement.innerHTML.length - 1) :
        adjElement.innerHTML.slice(1);
    const adjIndex = adjElement.getAttribute("index");
    if (adjElement.innerHTML === "") {
        adjElement.remove();
    }
    if (behindElement != null && behindElement.tagName === "SPAN") {
        behindElement.innerHTML = direction < 0 ? adjChar + behindElement.innerHTML : behindElement.innerHTML + adjChar;
        return;
    }
    const newElement = createPseudocodeSpan(adjChar, adjIndex);
    if (direction < 0) {
        activeElement.after(newElement);
        return;
    }
    activeElement.before(newElement);
}
function pseudocodeOnTab(eventProperties) {
    let oldCaretPosition = getCaretPosition();
    let activeElement = document.activeElement;
    if (eventProperties.key == "Tab") {
        eventProperties.preventDefault();
        let length = 0;
        let currentElement = activeElement.previousElementSibling;
        while (currentElement != null && currentElement.tagName === "SPAN") {
            length += currentElement.innerHTML.length;
            currentElement = currentElement.previousElementSibling;
        }
        const lineLength = length + getCaretPosition();
        const tabLength = 4 - (lineLength % 4);
        let spaces = "";
        for (let i = 0; i < tabLength; i++) {
            spaces += " ";
        }
        activeElement.innerHTML = insertString(activeElement.innerHTML, getCaretPosition(), spaces);
        setCaretPosition(activeElement, oldCaretPosition + tabLength);
    }
}
function insertString(defaultString, stringPosition, insertedString) {
    return defaultString.slice(0, stringPosition) + insertedString + defaultString.slice(stringPosition);
}
function pseudocodeOnKeyPress(e) {
    if (e.key === "Enter") {
        const activeElement = document.activeElement;
        const beforeCursor = activeElement.childNodes[0].nodeValue.replaceAll("\n", "");
        const beforeElement = createPseudocodeSpan(beforeCursor, activeElement.getAttribute("index"));
        beforeElement.classList.add("highlighted");
        let afterCursor = "";
        for (let i = 1; i < activeElement.childNodes.length && afterCursor === ""; i++) {
            afterCursor = activeElement.childNodes[i].nodeValue.replaceAll("\n", "");
        }
        const afterElement = createPseudocodeSpan(afterCursor, activeElement.getAttribute("index"));
        afterElement.classList.add("highlighted");
        const breakElement = document.createElement("br");
        activeElement.replaceWith(beforeElement, breakElement, afterElement);
        setCaretPosition(afterElement, 0);
        oldActiveElement = afterElement;
    }
}
function fixCtrlZ(eventParameters) {
    if (eventParameters.key === "z" && eventParameters.getModifierState("Control")) {
        eventParameters.preventDefault();
    }
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
        const prevIndex = prevElement?.getAttribute("index");
        const nextIndex = nextElement?.getAttribute("index");
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
        const newElement = createPseudocodeSpan("", breakpointIndex);
        newElement.classList.add("highlighted");
        insertPseudocodeSpan(newElement, activeElement, caretPosition);
        oldActiveElement = newElement;
    }
    const adjElementNext = document.activeElement.nextElementSibling;
    const adjElementPrev = document.activeElement.previousElementSibling;
    const activeElementIndex = document.activeElement.getAttribute("index");
    if (adjElementNext != null && adjElementNext.getAttribute("index") != null && adjElementNext.getAttribute("index") !== activeElementIndex && adjElementNext.innerHTML === "")
        adjElementNext.remove();
    if (adjElementPrev != null && adjElementPrev.getAttribute("index") != null && adjElementPrev.getAttribute("index") !== activeElementIndex && adjElementPrev.innerHTML === "")
        adjElementPrev.remove();
}
function mergeElements(e1, e2) {
    const i1 = e1?.getAttribute("index");
    const i2 = e2?.getAttribute("index");
    if (e1 != null && e2 != null && i1 != null && i1 === i2) {
        const text1 = e1.textContent;
        const text2 = e2.textContent;
        if (text1 != null && text2 != null) {
            const mergedElements = createPseudocodeSpan(text1 + text2, i1);
            e1.remove();
            e2.replaceWith(mergedElements);
            return mergedElements;
        }
    }
    return null;
}
function splitHtmlElement(element, index) {
    const text = element.innerText;
    const beforeText = text.slice(0, index);
    const afterText = text.slice(index, text.length);
    const elementIndex = element.getAttribute("index");
    if (elementIndex != null) {
        if (beforeText === "") {
            const afterElement = createPseudocodeSpan(afterText, elementIndex);
            if (element.classList.contains("highlighted"))
                afterElement.classList.add("highlighted");
            element.after(afterElement);
        }
        else if (afterText === "") {
            const beforeElement = createPseudocodeSpan(beforeText, elementIndex);
            if (element.classList.contains("highlighted"))
                beforeElement.classList.add("highlighted");
            element.before(beforeElement);
        }
        else {
            const beforeElement = createPseudocodeSpan(beforeText, elementIndex);
            const afterElement = createPseudocodeSpan(afterText, elementIndex);
            if (element.classList.contains("highlighted")) {
                afterElement.classList.add("highlighted");
                beforeElement.classList.add("highlighted");
            }
            element.before(beforeElement);
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
function insertPseudocodeSpan(newSpan, splitableSpan, index) {
    splitHtmlElement(splitableSpan, index);
    splitableSpan.replaceWith(newSpan);
    setCaretPosition(newSpan, 0);
}
function setCaretPosition(element, caretPos) {
    const selection = window.getSelection();
    const node = element.childNodes.length != 0 ? element.firstChild : element;
    if (selection == null)
        return;
    const range = document.createRange();
    selection.removeAllRanges();
    range.selectNodeContents(node);
    range.collapse(false);
    range.setStart(node, caretPos);
    range.setEnd(node, caretPos);
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