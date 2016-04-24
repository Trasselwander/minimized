
document.getElementById("attack").addEventListener("toggled", () => {
    var hex = new hexstat("canvas_attack");
    setTimeout(function () {
        hex.maxskill = 40; // max of animate arguments
        hex.animate(40, 10, 30, 15, 8, 35, 10, 30, 15, 8, 35, 40, "rgba(38, 94, 209, 0.5)", "rgba(18, 149, 33, 0.5)")
    }, 1000);
    console.log("updated");

    getPlayers();
});


window.addEventListener("load", () => {
    document.getElementById("cancel_btn").onclick = () => {
        toggleScreen(screens.overview.elm);
    }
});