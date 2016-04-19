
document.getElementById("overview").addEventListener("toggled", () => {
    var hex = new hexstat("main");
    setTimeout(function () {
        hex.animate(40, 10, 30, 15, 8, 35)
    }, 1000);
});