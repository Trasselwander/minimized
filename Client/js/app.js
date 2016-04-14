

function init() {
    var hex = new hexstat("main");
    setTimeout(function () {

        hex.animate(40, 10, 40, 10, 40, 10)
    }, 2000);
}


window.onload = init;
