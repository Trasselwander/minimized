var attack_hexstat;

document.getElementById("attack").addEventListener("toggled", () => {
    attack_hexstat.arr = [];
    screens.attack.visible = true;

    getPlayer();
    //getEnemy();
});

screens.attack.elm.addEventListener("enemy", () => {



});

document.getElementById("attack").addEventListener("detoggled", () => {
    attack_hexstat.arr = [];
    screens.attack.visible = false;
});

document.getElementById("overview").addEventListener("player", () => {
    if (!screens.attack.visible)
        return;

    attack_hexstat.maxskill = 40; //player.userData.level * 4; //ta den högsta leveln av båda karaktärerna.
    attack_hexstat.animate([{ "life": player.userStats.life, "speed": player.userStats.speed, "physicalattack": player.userStats.physicalattack, "physicaldefence": player.userStats.physicaldefence, "magicattack": player.userStats.magicattack, "magicdefence": player.userStats.magicdefence, "color": "rgba(38, 94, 209, 0.5)" },
        { "life": 5, "speed": 30, "physicalattack": 20, "physicaldefence": 10, "magicattack": 10, "magicdefence": 30, "color": "rgba(18, 149, 33, 0.5)" }])

    var attdiff = document.getElementById("attack_diff_table");
    var attdiffths = attdiff.getElementsByTagName("th");

    attdiffths[1].innerHTML = player.name;
    attdiffths[2].innerHTML = "adam"; //enemy name

    function shortAtt(statname, pvalue, evalue) {
        attdiff.getElementsByClassName("char_" + statname)[0].innerHTML = pvalue;
        attdiff.getElementsByClassName("enemy_" + statname)[0].innerHTML = evalue; // enenym life
        attdiff.getElementsByClassName(statname + "_diff")[0].innerHTML = pvalue - evalue; //enemy life
        attdiff.getElementsByClassName(statname + "_diff")[0].classList.add((pvalue - evalue == 0) ? "blue" : ((pvalue - evalue > 0) ? "green" : "red")); //enemy life
    }

    shortAtt("life", player.userStats.life, 10);
    shortAtt("speed", player.userStats.speed, 10);
    shortAtt("physA", player.userStats.physicalattack, 0);
    shortAtt("physD", player.userStats.physicaldefence, 2);
    shortAtt("magA", player.userStats.magicattack, 1);
    shortAtt("magD", player.userStats.magicdefence, 1);

    var totdiff = attdiff.getElementsByClassName("total_diff")[0];
    var totdiffval =  player.userStats.life + player.userStats.speed + player.userStats.physicalattack + player.userStats.physicaldefence + player.userStats.magicattack + player.userStats.magicdefence - 10 - 10 - 7 - 2 - 1 - 1;
    totdiff.innerHTML = totdiffval;
    totdiff.classList.add((totdiffval == 0) ? "blue" : ((totdiffval > 0) ? "green" : "red"));
});


window.addEventListener("load", () => {
    document.getElementById("cancel_btn").onclick = () => {
        toggleScreen(screens.overview.elm);
    }
    attack_hexstat = new hexstat("canvas_attack");
    attack_hexstat.drawLines();
    attack_hexstat.drawOutline();
});