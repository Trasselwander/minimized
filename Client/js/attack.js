
document.getElementById("attack").addEventListener("toggled", () => {
    var hex = new hexstat("canvas_attack");
    setTimeout(function () {
        hex.maxskill = 40; // max of animate arguments
        hex.animate([{ "life": 5, "speed": 10, "physicalattack": 20, "physicaldefence": 20, "magicattack": 10, "magicdefence": 15, "color": "rgba(38, 94, 209, 0.5)" },
            { "life": 5, "speed": 30, "physicalattack": 20, "physicaldefence": 10, "magicattack": 10, "magicdefence": 30, "color": "rgba(18, 149, 33, 0.5)" }])
    }, 1000);
    console.log("updated");

    //getPlayers();
});


window.addEventListener("load", () => {
    document.getElementById("cancel_btn").onclick = () => {
        toggleScreen(screens.overview.elm);
    }
});