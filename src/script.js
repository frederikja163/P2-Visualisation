var lines = document.querySelectorAll('p');
var _loop_1 = function (i) {
    lines[i].addEventListener("click", function () {
        if (lines[i].classList.contains('breakpoint')) {
            lines[i].classList.remove('breakpoint');
        }
        else {
            lines[i].classList.add('breakpoint');
        }
    });
};
for (var i = 0; i < lines.length; i++) {
    _loop_1(i);
}
//# sourceMappingURL=script.js.map