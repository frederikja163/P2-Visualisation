var breakpointClass = "breakpoint";
function breakpoint(code) {
    var lines = code.querySelectorAll("p");
    var _loop_1 = function (i) {
        lines[i].addEventListener("click", function () {
            if (lines[i].classList.contains(breakpointClass)) {
                lines[i].classList.remove(breakpointClass);
            }
            else {
                lines[i].classList.add(breakpointClass);
            }
        });
    };
    for (var i = 0; i < lines.length; i++) {
        _loop_1(i);
    }
}
window.onload = main;
function main() {
    breakpoint(document.body);
}
//# sourceMappingURL=script.js.map