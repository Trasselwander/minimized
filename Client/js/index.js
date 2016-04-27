
document.getElementById("overview").addEventListener("toggled", () => {
    var hex = new hexstat("main");
    setTimeout(function () {
        hex.maxskill = 30; // max of animate arguments
        hex.animate([{ "life": 5, "speed": 10, "physicalattack": 20, "physicaldefence": 20, "magicattack": 10, "magicdefence": 15, "color": "rgba(57, 174, 221, 0.65)" },
            { "life": 25, "speed": 10, "physicalattack": 0, "physicaldefence": 5, "magicattack": 30, "magicdefence": 15, "color": "rgba(0, 0, 0, 0.5)" },
            { "life": 30, "speed": 30, "physicalattack": 30, "physicaldefence": 0, "magicattack": 00, "magicdefence": 0, "color": "rgba(100, 0, 100, 0.3)" },
            { "life": 5, "speed": 30, "physicalattack": 20, "physicaldefence": 10, "magicattack": 10, "magicdefence": 30, "color": "rgba(0, 174, 0, 0.65)" }])

    }, 1000);
    console.log("updated");

    //getPlayers();
});


window.addEventListener("load", () => {
    document.getElementById("attack_btn").onclick = () => {
        toggleScreen(screens.attack.elm);
    }
});

document.getElementById("overview").addEventListener("player", () => { //player* but this code is never used.

    var chars = document.getElementsByClassName("char_name");
    //var me = player.indexOf(players.filter(p=> p.name == user.name)[0]);  //this is never used since we never draw out the closest characters. and we dont even get a list of more than one character


    //chars[3].innerHTML = "me";

    //for (var i = 0; i < me; i++) {
    //    chars[i + 3 - me].innerHTML = players[i].name;

    //}

    //for (var i = me + 1; i < players.length; i++) {
    //    chars[i + 3 - me].innerHTML = players[i].name;
    //}

    document.getElementById("player_dataStats").getElementsByTagName("td")[1].innerHTML = player.userStats.life;
    document.getElementById("player_dataStats").getElementsByTagName("td")[3].innerHTML = player.userStats.speed;
    document.getElementById("player_dataStats").getElementsByTagName("td")[5].innerHTML = player.userStats.physicalattack;
    document.getElementById("player_dataStats").getElementsByTagName("td")[7].innerHTML = player.userStats.physicaldefence;
    document.getElementById("player_dataStats").getElementsByTagName("td")[9].innerHTML = player.userStats.magicattack;
    document.getElementById("player_dataStats").getElementsByTagName("td")[11].innerHTML = player.userStats.magicdefence;

    document.getElementById("player_userStats").getElementsByTagName("td")[1].innerHTML = player.userData.level;
    document.getElementById("player_userStats").getElementsByTagName("td")[3].innerHTML = player.userData.exp;
    document.getElementById("player_userStats").getElementsByTagName("td")[5].innerHTML = player.userData.rank;
    document.getElementById("player_userStats").getElementsByTagName("td")[7].innerHTML = player.userData.bestrank;
    document.getElementById("player_userStats").getElementsByTagName("td")[9].innerHTML = player.userData.wins;
    document.getElementById("player_userStats").getElementsByTagName("td")[11].innerHTML = player.userData.losses;


    ////stats.getElementById("char_age").innerHTML = (new Date()).getTime() - player.userData.age;

});
