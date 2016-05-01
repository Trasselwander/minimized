var attack_hexstat;
var enemy_loaded = false;

document.getElementById("attack").addEventListener("toggled", () => {
    attack_hexstat.arr = [];
    screens.attack.visible = true;

    getPlayer();
    getEnemy();
});

screens.attack.elm.addEventListener("enemy", () => {
    console.log(enemy);

    if (enemy_loaded == true) {
        attack_hexstat.maxskill = Math.max(player.userStats.life, player.userStats.speed, player.userStats.physicalattack, player.userStats.physicaldefence, player.userStats.magicattack, player.userStats.magicdefence, enemy.userStats.life, enemy.userStats.speed, enemy.userStats.physicalattack, enemy.userStats.physicaldefence, enemy.userStats.magicattack, enemy.userStats.magicdefence);

        attack_hexstat.animate([{ "life": player.userStats.life, "speed": player.userStats.speed, "physicalattack": player.userStats.physicalattack, "physicaldefence": player.userStats.physicaldefence, "magicattack": player.userStats.magicattack, "magicdefence": player.userStats.magicdefence, "color": "rgba(38, 94, 209, 0.5)" },
            { "life": enemy.userStats.life, "speed": enemy.userStats.speed, "physicalattack": enemy.userStats.physicalattack, "physicaldefence": enemy.userStats.physicaldefence, "magicattack": enemy.userStats.magicattack, "magicdefence": enemy.userStats.magicdefence, "color": "rgba(18, 149, 33, 0.5)" }])
        displayData();
    }
    else enemy_loaded = true;

});

document.getElementById("attack").addEventListener("detoggled", () => {
    attack_hexstat.arr = [];
    screens.attack.visible = false;
});
function displayData() {

    var attdiff = document.getElementById("attack_diff_table");
    var attdiffths = attdiff.getElementsByTagName("th");

    attdiffths[1].innerHTML = player.name;
    attdiffths[2].innerHTML = enemy.name; //enemy name

    function shortAtt(statname, pvalue, evalue) {
        attdiff.getElementsByClassName("char_" + statname)[0].innerHTML = pvalue;
        attdiff.getElementsByClassName("enemy_" + statname)[0].innerHTML = evalue; // enenym life
        attdiff.getElementsByClassName(statname + "_diff")[0].innerHTML = pvalue - evalue; //enemy life
        attdiff.getElementsByClassName(statname + "_diff")[0].classList.remove("blue", "green", "red");
        attdiff.getElementsByClassName(statname + "_diff")[0].classList.add((pvalue - evalue == 0) ? "blue" : ((pvalue - evalue > 0) ? "green" : "red")); //enemy life
    }

    shortAtt("life", player.userStats.life, enemy.userStats.life);
    shortAtt("speed", player.userStats.speed, enemy.userStats.speed);
    shortAtt("physA", player.userStats.physicalattack, enemy.userStats.physicalattack);
    shortAtt("physD", player.userStats.physicaldefence, enemy.userStats.physicaldefence);
    shortAtt("magA", player.userStats.magicattack, enemy.userStats.magicattack);
    shortAtt("magD", player.userStats.magicdefence, enemy.userStats.magicdefence);

    var totdiff = attdiff.getElementsByClassName("total_diff")[0];
    var totdiffval = (player.userStats.life + player.userStats.speed + player.userStats.physicalattack + player.userStats.physicaldefence + player.userStats.magicattack + player.userStats.magicdefence) - (enemy.userStats.life + enemy.userStats.speed + enemy.userStats.physicalattack + enemy.userStats.physicaldefence + enemy.userStats.magicattack + enemy.userStats.magicdefence);
    totdiff.innerHTML = totdiffval;
    totdiff.classList.remove("blue", "green", "red");
    totdiff.classList.add((totdiffval == 0) ? "blue" : ((totdiffval > 0) ? "green" : "red"));


}
document.getElementById("overview").addEventListener("player", () => {
    if (!screens.attack.visible)
        return;

    if (enemy_loaded == true) {

        attack_hexstat.maxskill = Math.max(player.userStats.life, player.userStats.speed, player.userStats.physicalattack, player.userStats.physicaldefence, player.userStats.magicattack, player.userStats.magicdefence, enemy.userStats.life, enemy.userStats.speed, enemy.userStats.physicalattack, enemy.userStats.physicaldefence, enemy.userStats.magicattack, enemy.userStats.magicdefence);

        attack_hexstat.animate([{ "life": player.userStats.life, "speed": player.userStats.speed, "physicalattack": player.userStats.physicalattack, "physicaldefence": player.userStats.physicaldefence, "magicattack": player.userStats.magicattack, "magicdefence": player.userStats.magicdefence, "color": "rgba(38, 94, 209, 0.5)" },
            { "life": enemy.userStats.life, "speed": enemy.userStats.speed, "physicalattack": enemy.userStats.physicalattack, "physicaldefence": enemy.userStats.physicaldefence, "magicattack": enemy.userStats.magicattack, "magicdefence": enemy.userStats.magicdefence, "color": "rgba(18, 149, 33, 0.5)" }])
        displayData();
    }
    else enemy_loaded = true;



});


window.addEventListener("load", () => {
    document.getElementById("cancel_btn").onclick = () => {
        toggleScreen(screens.overview.elm);
    }
    document.getElementById("next_match_btn").onclick = () => {
        toggleScreen(screens.attack.elm);
    }
    document.getElementById("attack_request_btn").onclick = () => {
        sendRequest("/battle/init/" + enemy.ID, (test, error) => {
            if (!error) {
                battleLife = JSON.parse(test);
                screens.battle.elm.dispatchEvent(new Event("init"));
                toggleScreen(screens.battle.elm);

            }
        });
    }
    attack_hexstat = new hexstat("canvas_attack");
    attack_hexstat.drawLines();
    attack_hexstat.drawOutline();
});