
screens.overview.elm.addEventListener("player", () => {
    if (player == null || player.userStats == null) return;

    var exp = player.userStats.exp,
        totalexp = Math.ceil(10 * Math.pow(player.userStats.level, 1.4));

    if (enemy != null) {
        var expgain = Math.ceil(Math.pow(enemy.userStats.level + 2, 2) / player.userStats.level) * 16;
        if (expgain + exp > totalexp) expgain = totalexp - exp;

        document.getElementById("gained_exp").style.width = (expgain / totalexp) * 100 + '%';
    }

    document.getElementById("current_exp").style.width = (exp / totalexp) * 100 + '%';

});

document.getElementById("attack").addEventListener("detoggled", () => {
    document.getElementById("gained_exp").style.display = "none";
});
document.getElementById("attack").addEventListener("toggled", () => {
    document.getElementById("gained_exp").style.display = null;

});
screens.battle.elm.addEventListener("toggled", () => {
    document.getElementById("gained_exp").style.display = null;
});
screens.battle.elm.addEventListener("detoggled", () => {
    document.getElementById("gained_exp").style.display = "none";

});

screens.attack.elm.addEventListener("enemy", () => {
    var expgain = Math.ceil(Math.pow(enemy.userStats.level + 2, 2) / player.userStats.level) * 16,
        totalexp = Math.ceil(10 * Math.pow(player.userStats.level, 1.4)),
        exp = player.userStats.exp;


    if (expgain + exp > totalexp) expgain = totalexp - exp;


    document.getElementById("gained_exp").style.width = (expgain / totalexp) * 100 + '%';
});



