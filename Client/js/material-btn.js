﻿window.addEventListener("load", () => {
    [].forEach.call(document.querySelectorAll('.material-btn'), function (b) {
        b.onmouseenter = function (e) {
            var c = document.createElement('div'),
                size = Math.sqrt(Math.pow(b.offsetWidth, 2) + Math.pow(b.offsetHeight, 2));
            b.appendChild(c);
            c.className = 'circle';
            c.style.top = e.offsetY + 'px';
            c.style.left = e.offsetX + 'px';
            c.style.top = b.offsetHeight / 2 - size / 2 + 'px';
            c.style.left = b.offsetWidth / 2 - size / 2 + 'px';
            c.style.width = c.style.height = size + 'px';
            b.onmouseleave = (function (c) {
                return function () {
                    c.style.opacity = 0;
                    setTimeout(function () { b.removeChild(c) }, 500);
                }
            })(c);
        };
    });
});