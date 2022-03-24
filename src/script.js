var breakpointClass = "breakpoint";
var selectedCode = "selectedCode";
function breakpoint(code) {
    var lines = code.querySelectorAll("p");
    var _loop_1 = function (i) {
        lines[i].addEventListener("dblclick", statementOnDblClick);
        lines[i].addEventListener("click", function () { return statementOnClick(lines[i]); });
    };
    for (var i = 0; i < lines.length; i++) {
        _loop_1(i);
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
    var selected = document.getElementById(selectedCode);
    line.id = selectedCode;
    if (selected != null) {
        selected.id = "";
    }
}
window.onload = main;
function main() {
    var left = document.querySelector("#left");
    var right = document.querySelector("#right");
    breakpoint(left);
    pseudocode(right);
}
function pseudocode(right) {
    setCaretPosition(document.querySelector("span"), 0);
    right.addEventListener("input", pseudocodeOnInput);
    right.addEventListener("click", pseudocodeOnClick);
}
function pseudocodeOnInput(ev) {
    var pseudocode = ev.target;
    var text = ev.data;
}
function pseudocodeOnClick() {
    var activeElement = document.activeElement;
    if (!(activeElement instanceof HTMLSpanElement)) {
        activeElement = document.querySelector("#right > span:last-child");
    }
    var text = activeElement.textContent;
    var carretPosition = getCarretPosition();
    var beforeCursor = text.slice(0, carretPosition);
    var afterCursor = text.slice(carretPosition, text.length);
    var beforeElement = document.createElement("span");
    beforeElement.setAttribute("contenteditable", "true");
    beforeElement.innerText = beforeCursor;
    activeElement.before(beforeElement);
    var afterElement = document.createElement("span");
    afterElement.setAttribute("contenteditable", "true");
    afterElement.innerText = afterCursor;
    activeElement.after(afterElement);
    var newElement = document.createElement("span");
    newElement.setAttribute("contenteditable", "true");
    activeElement.replaceWith(newElement);
    setCaretPosition(newElement, 0);
}
function setCaretPosition(element, caretPos) {
    var selection = window.getSelection();
    var range = document.createRange();
    selection.removeAllRanges();
    range.selectNodeContents(element);
    range.collapse(false);
    range.setStart(element, caretPos);
    range.setEnd(element, caretPos);
    selection.addRange(range);
    element.focus();
}
function getCarretPosition() {
    var selection = window.getSelection();
    selection.getRangeAt(0);
    return selection.getRangeAt(0).startOffset;
}
//# sourceMappingURL=script.js.map