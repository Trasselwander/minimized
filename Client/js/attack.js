
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


    document.getElementById("attack_diff_table").getElementsByClassName("char_life")[0].innerHTML = player.userStats.life;
    document.getElementById("attack_diff_table").getElementsByClassName("enemy_life")[0].innerHTML = 10; // enenym life
    document.getElementById("attack_diff_table").getElementsByClassName("life_diff")[0].innerHTML = player.userStats.life - 10; //enemy life
    document.getElementById("attack_diff_table").getElementsByClassName("life_diff")[0].classList.add((player.userStats.life - 10 == 0) ? "blue" : ((player.userStats.life - 10 > 0) ? "green" : "red")); //enemy life

    document.getElementById("attack_diff_table").getElementsByClassName("char_speed")[0].innerHTML = player.userStats.speed;
    document.getElementById("attack_diff_table").getElementsByClassName("enemy_speed")[0].innerHTML = 10; //enemy speed
    document.getElementById("attack_diff_table").getElementsByClassName("speed_diff")[0].innerHTML = player.userStats.speed - 10; //enemy speed
    document.getElementById("attack_diff_table").getElementsByClassName("speed_diff")[0].classList.add((player.userStats.speed - 10 == 0) ? "blue" : ((player.userStats.speed - 10 > 0) ? "green" : "red")); //enemy life

    document.getElementById("attack_diff_table").getElementsByClassName("char_physA")[0].innerHTML = player.userStats.physicalattack;
    document.getElementById("attack_diff_table").getElementsByClassName("enemy_physA")[0].innerHTML = 0; //enemy physical attack
    document.getElementById("attack_diff_table").getElementsByClassName("physA_diff")[0].innerHTML = player.userStats.physicalattack - 0; //enemy physical attack
    document.getElementById("attack_diff_table").getElementsByClassName("physA_diff")[0].classList.add((player.userStats.physicalattack - 0 == 0) ? "blue" : ((player.userStats.physicalattack - 0 > 0) ? "green" : "red")); //enemy life

    document.getElementById("attack_diff_table").getElementsByClassName("char_physD")[0].innerHTML = player.userStats.physicaldefence;
    document.getElementById("attack_diff_table").getElementsByClassName("enemy_physD")[0].innerHTML = 2; // enemy physicaldefence
    document.getElementById("attack_diff_table").getElementsByClassName("physD_diff")[0].innerHTML = player.userStats.physicaldefence - 2; // enemy physicaldefence
    document.getElementById("attack_diff_table").getElementsByClassName("physD_diff")[0].classList.add((player.userStats.physicaldefence - 10 == 0) ? "blue" : ((player.userStats.physicaldefence - 10 > 0) ? "green" : "red")); //enemy life

    document.getElementById("attack_diff_table").getElementsByClassName("char_magA")[0].innerHTML = player.userStats.magicattack;
    document.getElementById("attack_diff_table").getElementsByClassName("enemy_magA")[0].innerHTML = 1; // enemy magicattack
    document.getElementById("attack_diff_table").getElementsByClassName("magA_diff")[0].innerHTML = player.userStats.magicattack - 1; // enemy magicattack
    document.getElementById("attack_diff_table").getElementsByClassName("magA_diff")[0].classList.add((player.userStats.magicattack - 1 == 0) ? "blue" : ((player.userStats.magicattack - 1 > 0) ? "green" : "red")); //enemy life

    document.getElementById("attack_diff_table").getElementsByClassName("char_magD")[0].innerHTML = player.userStats.magicdefence;
    document.getElementById("attack_diff_table").getElementsByClassName("enemy_magD")[0].innerHTML = 1; //enemy magicdefence
    document.getElementById("attack_diff_table").getElementsByClassName("magD_diff")[0].innerHTML = player.userStats.magicdefence - 1; // enemy magicdefence
    document.getElementById("attack_diff_table").getElementsByClassName("magD_diff")[0].classList.add((player.userStats.magicdefence - 1 == 0) ? "blue" : ((player.userStats.magicdefence - 1 > 0) ? "green" : "red")); //enemy life

    document.getElementById("attack_diff_table").getElementsByClassName("total_diff")[0].innerHTML = player.userStats.life + player.userStats.speed + player.userStats.physicalattack + player.userStats.physicaldefence + player.userStats.magicattack + player.userStats.magicdefence - 10 - 10 - 7 - 2 - 1 - 1; // enemy stats
    document.getElementById("attack_diff_table").getElementsByClassName("total_diff")[0].classList.add((parseInt(document.getElementById("attack_diff_table").getElementsByClassName("total_diff")[0].innerHTML) == 0) ? "blue" : ((parseInt(document.getElementById("attack_diff_table").getElementsByClassName("total_diff")[0].innerHTML) > 0) ? "green" : "red"));




});


window.addEventListener("load", () => {
    document.getElementById("cancel_btn").onclick = () => {
        toggleScreen(screens.overview.elm);
    }
    document.getElementById("attack_request_btn").onclick = () => {
        sendRequest("/players/enemy", (test, error) => {
            //send us to the "fight screen"
        });
    }
});