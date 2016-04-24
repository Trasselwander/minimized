
document.getElementById("overview").addEventListener("toggled", () => {
    var hex = new hexstat("main");
    setTimeout(function () {
        hex.maxskill = 40; // max of animate arguments
        hex.animate(40, 10, 30, 15, 8, 35)
    }, 1000);
    console.log("updated");

    //getPlayers();
});


window.addEventListener("load", () => {
    document.getElementById("attack_btn").onclick = () => {
        toggleScreen(screens.attack.elm);
    }
});

document.getElementById("overview").addEventListener("players", () => {

    var chars = document.getElementsByClassName("char_name");
    var me = players.indexOf(players.filter(p=> p.name == user.name)[0]);


    chars[3].innerHTML = "me";

    for (var i = 0; i < me; i++) {
        chars[i + 3 - me].innerHTML = players[i].name;

    }

    for (var i = me + 1; i < players.length; i++) {
        chars[i + 3 - me].innerHTML = players[i].name;
    }


    // Visa oss själva

    document.getElementById("char_level").innerHTML = players[me].userData.level;
    document.getElementById("char_exp").innerHTML = players[me].userData.exp;
    document.getElementById("char_bestrank").innerHTML = players[me].userData.bestrank;
    document.getElementById("char_rank").innerHTML = players[me].userData.bestrank;
    document.getElementById("char_hat").innerHTML = "not implemented";
    document.getElementById("char_age").innerHTML = (new Date()).getTime() - players[me].userData.age;
    document.getElementById("char_wins").innerHTML = players[me].userData.wins;
    document.getElementById("char_losses").innerHTML = players[me].userData.losses;


    document.getElementById("char_life").innerHTML = players[me].userStats.life;
    document.getElementById("char_exp").innerHTML = players[me].userData.exp;
    document.getElementById("char_bestrank").innerHTML = players[me].userData.bestrank;
    document.getElementById("char_hat").innerHTML = "not implemented";
    document.getElementById("char_age").innerHTML = (new Date()).getTime() - players[me].userData.age;
    document.getElementById("char_wins").innerHTML = players[me].userData.wins;
    document.getElementById("char_losses").innerHTML = players[me].userData.losses;
});
