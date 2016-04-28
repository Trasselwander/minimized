
document.getElementById("overview").addEventListener("toggled", () => {
    var hex = new hexstat("main");
    setTimeout(function () {
        hex.maxskill = player.userData.level * 4; // max of animate arguments
        hex.animate([{ "life": player.userStats.life, "speed": player.userStats.speed, "physicalattack": player.userStats.physicalattack, "physicaldefence": player.userStats.physicaldefence, "magicattack": player.userStats.magicattack, "magicdefence": player.userStats.magicdefence, "color": "rgba(57, 174, 221, 0.65)" }//,
        ]) //{ "life": 25, "speed": 10, "physicalattack": 0, "physicaldefence": 5, "magicattack": 30, "magicdefence": 15, "color": "rgba(0, 0, 0, 0.5)" },
        //{ "life": 30, "speed": 30, "physicalattack": 30, "physicaldefence": 0, "magicattack": 00, "magicdefence": 0, "color": "rgba(100, 0, 100, 0.3)" },
        //{ "life": 5, "speed": 30, "physicalattack": 20, "physicaldefence": 10, "magicattack": 10, "magicdefence": 30, "color": "rgba(0, 174, 0, 0.65)" }

    }, 1000);
    console.log("updated");

    //getPlayers();
});


window.addEventListener("load", () => {
    document.getElementById("attack_btn").onclick = () => {
        toggleScreen(screens.attack.elm);
    }
    document.getElementById("league_btn").onclick = () => {
        toggleScreen(screens.league.elm);
    }

});

document.getElementById("overview").addEventListener("player", () => { //player* but this code is never used.

    var timenow = new Date().getTime();
    var diff = timenow - player.userData.age;

    var days = Math.floor(diff / (1000 * 60 * 60 * 24));
    diff -= days * (1000 * 60 * 60 * 24);

    var hours = Math.floor(diff / (1000 * 60 * 60));
    diff -= hours * (1000 * 60 * 60);

    var mins = Math.floor(diff / (1000 * 60));
    diff -= mins * (1000 * 60);

    for (var i = 0; i < document.getElementsByClassName("info_name").length; i++) {
        document.getElementsByClassName("info_name")[i].innerHTML = player.name;
    }
    if (days <= 0) document.getElementById("info_age_days_holder").style.display = "none";
    if (hours <= 0) document.getElementById("info_age_hours_holder").style.display = "none";

    document.getElementById("info_age_days").innerHTML = days + " dagar";
    document.getElementById("info_age_hours").innerHTML = hours + " timmar";
    document.getElementById("info_age_minutes").innerHTML = mins + " minuter";
    //document.getElementById("info_rank").innerHTML = player.bestrank; //fix rank later
    //document.getElementById("info_currentsession").innerHTML = player.bestrank; //fix time later

    

    document.getElementById("player_dataStats").getElementsByClassName("char_life")[0].innerHTML = player.userStats.life;
    document.getElementById("player_dataStats").getElementsByClassName("char_speed")[0].innerHTML = player.userStats.speed;
    document.getElementById("player_dataStats").getElementsByClassName("char_physA")[0].innerHTML = player.userStats.physicalattack;
    document.getElementById("player_dataStats").getElementsByClassName("char_physD")[0].innerHTML = player.userStats.physicaldefence;
    document.getElementById("player_dataStats").getElementsByClassName("char_magA")[0].innerHTML = player.userStats.magicattack;
    document.getElementById("player_dataStats").getElementsByClassName("char_magD")[0].innerHTML = player.userStats.magicdefence;

    document.getElementById("player_userStats").getElementsByClassName("char_level")[0].innerHTML = player.userStats.level;
    document.getElementById("player_userStats").getElementsByClassName("char_exp")[0].innerHTML = player.userStats.exp;
    document.getElementById("player_userStats").getElementsByClassName("char_rank")[0].innerHTML = player.userStats.rank;
    document.getElementById("player_userStats").getElementsByClassName("char_bestRank")[0].innerHTML = player.userStats.bestrank;
    document.getElementById("player_userStats").getElementsByClassName("char_wins")[0].innerHTML = player.userStats.wins;
    document.getElementById("player_userStats").getElementsByClassName("char_losses")[0].innerHTML = player.userStats.losses;


    ////stats.getElementById("char_age").innerHTML = (new Date()).getTime() - player.userData.age;

});
