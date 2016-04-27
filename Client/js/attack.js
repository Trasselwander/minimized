
document.getElementById("attack").addEventListener("toggled", () => {
    var hex = new hexstat("canvas_attack");
    setTimeout(function () {
        hex.maxskill = 40; // max of animate arguments
        hex.animate([{ "life": 5, "speed": 10, "physicalattack": 20, "physicaldefence": 20, "magicattack": 10, "magicdefence": 15, "color": "rgba(38, 94, 209, 0.5)" },
            { "life": 5, "speed": 30, "physicalattack": 20, "physicaldefence": 10, "magicattack": 10, "magicdefence": 30, "color": "rgba(18, 149, 33, 0.5)" }])
    }, 1000);
    console.log("updated");

    getPlayer();
    //getEnemy();
});
document.getElementById("overview").addEventListener("player", () => {
    var hex = new hexstat("canvas_attack");
    setTimeout(function () {
        hex.maxskill = 40; //player.userData.level * 4; //ta den högsta leveln av båda karaktärerna.
        hex.animate([{ "life": player.userStats.life, "speed": player.userStats.speed, "physicalattack": player.userStats.physicalattack, "physicaldefence": player.userStats.physicaldefence, "magicattack": player.userStats.magicattack, "magicdefence": player.userStats.magicdefence, "color": "rgba(38, 94, 209, 0.5)" },
            { "life": 5, "speed": 30, "physicalattack": 20, "physicaldefence": 10, "magicattack": 10, "magicdefence": 30, "color": "rgba(18, 149, 33, 0.5)" }])
    }, 1000);
    document.getElementById("attack_diff_table").getElementsByTagName("th")[1].innerHTML = player.name;
    document.getElementById("attack_diff_table").getElementsByTagName("th")[2].innerHTML = "adam"; //enemy name


    document.getElementById("attack_diff_table").getElementsByTagName("td")[1].innerHTML = player.userStats.life;
    document.getElementById("attack_diff_table").getElementsByTagName("td")[2].innerHTML = 10; // enenym life
    document.getElementById("attack_diff_table").getElementsByTagName("td")[3].innerHTML = player.userStats.life - 10; //enemy life

    document.getElementById("attack_diff_table").getElementsByTagName("td")[5].innerHTML = player.userStats.speed;
    document.getElementById("attack_diff_table").getElementsByTagName("td")[6].innerHTML = 10; //enemy speed
    document.getElementById("attack_diff_table").getElementsByTagName("td")[7].innerHTML = player.userStats.speed - 10; //enemy speed

    document.getElementById("attack_diff_table").getElementsByTagName("td")[9].innerHTML = player.userStats.physicalattack;
    document.getElementById("attack_diff_table").getElementsByTagName("td")[10].innerHTML = 7; //enemy physical attack
    document.getElementById("attack_diff_table").getElementsByTagName("td")[11].innerHTML = player.userStats.physicalattack - 7; //enemy physical attack

    document.getElementById("attack_diff_table").getElementsByTagName("td")[13].innerHTML = player.userStats.physicaldefence;
    document.getElementById("attack_diff_table").getElementsByTagName("td")[14].innerHTML = 2; // enemy physicaldefence
    document.getElementById("attack_diff_table").getElementsByTagName("td")[15].innerHTML = player.userStats.physicaldefence - 2; // enemy physicaldefence

    document.getElementById("attack_diff_table").getElementsByTagName("td")[17].innerHTML = player.userStats.magicattack;
    document.getElementById("attack_diff_table").getElementsByTagName("td")[18].innerHTML = 1; // enemy magicattack
    document.getElementById("attack_diff_table").getElementsByTagName("td")[19].innerHTML = player.userStats.magicattack - 1; // enemy magicattack

    document.getElementById("attack_diff_table").getElementsByTagName("td")[21].innerHTML = player.userStats.magicdefence;
    document.getElementById("attack_diff_table").getElementsByTagName("td")[22].innerHTML = 11; //enemy magicdefence
    document.getElementById("attack_diff_table").getElementsByTagName("td")[23].innerHTML = player.userStats.magicdefence - 1; // enemy magicdefence

    document.getElementById("attack_diff_table").getElementsByTagName("td")[27].innerHTML = player.userStats.life + player.userStats.speed + player.userStats.physicalattack + player.userStats.physicaldefence + player.userStats.magicattack + player.userStats.magicdefence - 10 - 10 - 7 - 2 - 1- 1; // enemy stats





});


window.addEventListener("load", () => {
    document.getElementById("cancel_btn").onclick = () => {
        toggleScreen(screens.overview.elm);
    }
});