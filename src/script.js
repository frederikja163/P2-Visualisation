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
    const lines = code.querySelectorAll("span");
    for (let i = 0; i < lines.length; i++) {
        lines[i].addEventListener("click", function () {
            if (lines[i].classList.contains(breakpointClass)) {
                lines[i].classList.remove(breakpointClass);
            }
            else {
                lines[i].classList.add(breakpointClass);
            }
            parseCode();
        });
    }
}
let currentPromise;
let resolveCurrentPromise;
let codeFunction = null;
function runCode() {
    currentPromise = new Promise((resolve, reject) => {
        resolveCurrentPromise = resolve;
    });
    if (codeFunction != null) {
        codeFunction();
    }
}
function next() {
    resolveCurrentPromise();
}
function parseCode() {
    var _a;
    removeAllHighligting();
    let code = "";
    const lines = (_a = document.getElementById("code")) === null || _a === void 0 ? void 0 : _a.querySelectorAll("span");
    for (let i = 0; i < lines.length; i++) {
        let currentLine = lines[i].innerHTML.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');
        currentLine = addAsync(currentLine);
        currentLine = addBreakpoint(currentLine, lines, i);
        code += currentLine + "\n";
    }
    codeFunction = new Function('return ' + code)();
}
function addAsync(currentLine) {
    let indexOfFunction = currentLine.indexOf("function");
    if (indexOfFunction != -1) {
        return currentLine.substring(0, indexOfFunction) + "async " + currentLine.substring(indexOfFunction, currentLine.length);
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
        highLight(line);
        yield currentPromise;
        removeHighLight(line);
        currentPromise = new Promise((resolve, reject) => {
            resolveCurrentPromise = resolve;
        });
        return true;
    });
}
function darkMode() {
    const bodyElement = document.body;
    const darkModeBtn = document.querySelector("#darkModeBtn");
    const rightTextBox = document.querySelector("#righttextbox");
    const dropdownContent = document.querySelector(".dropdown-content");
    rightTextBox.classList.toggle("dark-mode");
    bodyElement.classList.toggle("dark-mode");
    dropdownContent.classList.toggle("dark-mode");
    bodyElement.classList.contains("dark-mode") ? darkModeBtn.value = "Light Mode" :
        darkModeBtn.value = "Dark Mode ";
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
for (let option of options) {
    option.addEventListener("click", function dropDownSelector(event) {
        let dropdownBtn = document.querySelector(".dropdown > button");
        switch (event.target.id) {
            case "mergesort":
                displayCodeAsString(left, algMergeSort);
                dropdownBtn.innerHTML = "MergeSort";
                break;
            case "binarysearch":
                displayCodeAsString(left, algBinarySearch);
                dropdownBtn.innerHTML = "Binary Search";
                break;
            case "bubblesort":
                displayCodeAsString(left, algBubbleSort);
                dropdownBtn.innerHTML = "Bubble Sort";
                break;
        }
    });
}
function highLight(index) {
    let currParagraph = document.querySelector("span[index=\"" + index + "\"]");
    if (currParagraph != null)
        currParagraph.classList.add("highlighted");
}
function removeHighLight(index) {
    let currParagraph = document.querySelector("span[index=\"" + index + "\"]");
    if (currParagraph != null)
        currParagraph.classList.remove("highlighted");
}
function removeAllHighligting() {
    var _a, _b;
    const lineCount = (_b = (_a = document.getElementById("code")) === null || _a === void 0 ? void 0 : _a.querySelectorAll("span")) === null || _b === void 0 ? void 0 : _b.length;
    for (let i = 0; i < lineCount; i++) {
        removeHighLight(i);
    }
}
window.onload = main;
function main() {
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
    binarySearch([201, 176, 90, 63, 12], 90);
}
function algBubbleSort() {
    function bubbleSort(arr) {
        var i, j;
        var len = arr.length;
        var isSwapped = false;
        for (i = 0; i < len; i++) {
            isSwapped = false;
            for (j = 0; j < len; j++) {
                if (arr[j] > arr[j + 1]) {
                    var temp = arr[j];
                    arr[j] = arr[j + 1];
                    arr[j + 1] = temp;
                    isSwapped = true;
                }
            }
            if (!isSwapped) {
                break;
            }
        }
        console.log(arr);
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
        console.log(array);
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
        console.log(array);
        return array;
    }
    mergeSort([5, 2, 3, 1, 58]);
}
//# sourceMappingURL=script.js.map