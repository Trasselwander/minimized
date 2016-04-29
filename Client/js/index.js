var main_hex;

document.getElementById("overview").addEventListener("toggled", () => {
    getPlayer();
    screens.overview.visible = true;
});

document.getElementById("overview").addEventListener("detoggled", () => {
    screens.overview.visible = false;
    main_hex.arr = [];
});

window.addEventListener("load", () => {
    document.getElementById("attack_btn").onclick = () => {
        toggleScreen(screens.attack.elm);
    }
    document.getElementById("league_btn").onclick = () => {
        toggleScreen(screens.league.elm);
        getPlayer();
    }
    main_hex = new hexstat("main");
    main_hex.drawLines();
    main_hex.drawOutline();
});

document.getElementById("overview").addEventListener("player", () => { //player* but this code is never used.
    if (!screens.overview.visible)
        return;

    main_hex.maxskill = player.userStats.level * 4; // max of animate arguments
    player.userStats.color = "rgba(57, 174, 221, 0.65)";
    main_hex.animate([player.userStats]) //{ "life": 25, "speed": 10, "physicalattack": 0, "physicaldefence": 5, "magicattack": 30, "magicdefence": 15, "color": "rgba(0, 0, 0, 0.5)" },

    var timenow = new Date().getTime();
    var agedhm = getDaysHoursMins(timenow - player.age)
    var lldhm = getDaysHoursMins(timenow - player.lastloggedin)

    for (var i = 0; i < document.getElementsByClassName("info_name").length; i++) {
        document.getElementsByClassName("info_name")[i].innerHTML = player.name;
    }
    if (agedhm.days <= 0) document.getElementById("info_age_days_holder").style.display = "none";
    if (agedhm.hours <= 0) document.getElementById("info_age_hours_holder").style.display = "none";

    document.getElementById("info_age_days").innerHTML = agedhm.days + " dagar";
    document.getElementById("info_age_hours").innerHTML = agedhm.hours + " timmar";
    document.getElementById("info_age_minutes").innerHTML = agedhm.mins + " minuter";

    if (lldhm.llimins == 0 && lldhm.llihours == 0 && lldhm.llimins == 0) {
        document.getElementById("info_currentsession_holder").style.display = "none";
        document.getElementById("info_currentsession_addon").style.display = "inline";
    } else {
        var info_currses = document.getElementById("info_currentsession");
        if (lldhm.llimins != 0) info_currses.innerHTML = lldhm.llimins + " minuters";
        if (lldhm.llihours != 0) info_currses.innerHTML = lldhm.llihours + " timmars";
        if (lldhm.llidays != 0) info_currses.innerHTML = lldhm.llidays + " dagars";
    }
    //document.getElementById("info_rank").innerHTML = player.bestrank; //fix rank later
    //document.getElementById("info_currentsession").innerHTML = player.bestrank; //fix time later

    var pstats = document.getElementById("player_dataStats");

    pstats.getElementsByClassName("char_life")[0].getElementsByTagName('span')[0].innerHTML = player.userStats.life;
    pstats.getElementsByClassName("char_speed")[0].getElementsByTagName('span')[0].innerHTML = player.userStats.speed;
    pstats.getElementsByClassName("char_physA")[0].getElementsByTagName('span')[0].innerHTML = player.userStats.physicalattack;
    pstats.getElementsByClassName("char_physD")[0].getElementsByTagName('span')[0].innerHTML = player.userStats.physicaldefence;
    pstats.getElementsByClassName("char_magA")[0].getElementsByTagName('span')[0].innerHTML = player.userStats.magicattack;
    pstats.getElementsByClassName("char_magD")[0].getElementsByTagName('span')[0].innerHTML = player.userStats.magicdefence;

    var sp_arr = ["char_life", "char_speed", "char_physA", "char_physD", "char_magA", "char_magD"];

    if (player.userStats.skillpoints > 0)
        for (var i = 0; i < sp_arr.length; i++)
            pstats.getElementsByClassName(sp_arr[i])[0].classList.add("char_sp_up");
    else
        for (var i = 0; i < sp_arr.length; i++)
            pstats.getElementsByClassName(sp_arr[i])[0].classList.remove("char_sp_up");

    var ustats = document.getElementById("player_userStats");

    ustats.getElementsByClassName("char_level")[0].innerHTML = player.userStats.level;
    ustats.getElementsByClassName("char_exp")[0].innerHTML = player.userStats.exp;
    ustats.getElementsByClassName("char_rank")[0].innerHTML = player.userStats.rank;
    ustats.getElementsByClassName("char_bestRank")[0].innerHTML = player.userStats.bestrank;
    ustats.getElementsByClassName("char_wins")[0].innerHTML = player.userStats.wins;
    ustats.getElementsByClassName("char_losses")[0].innerHTML = player.userStats.losses;
});
