
function init() {
    document.getElementById("reg").onclick = function () {
        document.getElementById("login").style.display = "none";
        document.getElementById("register").style.display = null;
    }
    document.getElementById("log").onclick = function () {
        document.getElementById("register").style.display = "none";
        document.getElementById("login").style.display = null;
    }
}

window.onload = init;