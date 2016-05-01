var main_hex;

document.getElementById("overview").addEventListener("toggled", () => {
    getPlayer();
    screens.overview.visible = true;
});

screens.overview.elm.addEventListener("detoggled", () => {
    screens.overview.visible = false;
    main_hex.arr = [];
});

window.addEventListener("load", () => {
    document.getElementById("attack_btn").onclick = () => {
        if (!player.userStats)
            swal({
                title: "Fel!",
                text: "Du måste gå med i en tävling för att kunna attackera någon!",
                type: "error",
            });
        else
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

screens.overview.elm.addEventListener("top10", () => { //player* but this code is never used.
    if (!screens.overview.visible)
        return;

    var t10 = document.getElementsByClassName("top10")[0].getElementsByTagName("tbody")[0];
    var trs = t10.getElementsByTagName("tr");


    var pscore = -1;
    var ind = 1;

    for (var i = 0; i < top10.length; i++) {
        trs[i].style.display = null;

        var t = top10[i];

        var tds = trs[i].getElementsByTagName("td");
        var rank = tds[0];
        var name = tds[1];
        var score = tds[2];
        var lvl = tds[3];

        if (pscore == t.userStats.score) ind--;
        pscore = t.userStats.score;

        rank.innerHTML = ind++;
        name.innerHTML = t.name;
        score.innerHTML = t.userStats.score;
        name.lvl = t.userStats.level;
    }

    for (var i = 10 - top10.length; i > 0; i--) trs[10 - i].style.display = "none"; // if less than 10 players;

    console.log(top10);
});

screens.overview.elm.addEventListener("player", () => { //player* but this code is never used.
    if (!screens.overview.visible)
        return;

    getTop10();


    var timenow = new Date().getTime();
    var agedhm = getDaysHoursMins(timenow - player.age)

    var lldhm = getDaysHoursMins(timenow - player.lastloggedin)

    for (var i = 0; i < document.getElementsByClassName("info_name").length; i++) {
        document.getElementsByClassName("info_name")[i].innerHTML = player.name;
    }
    if (agedhm.days <= 0) document.getElementById("info_age_days_holder").style.display = "none";
    if (agedhm.hours <= 0) document.getElementById("info_age_hours_holder").style.display = "none";

    document.getElementById("info_age_days").innerHTML = agedhm.days + (agedhm.days == 1 ? " dag" : " dagar");
    document.getElementById("info_age_hours").innerHTML = agedhm.hours + (agedhm.hours == 1 ? " timme" : " timmar");
    document.getElementById("info_age_minutes").innerHTML = agedhm.mins + (agedhm.mins == 1 ? " minut" : " minuter");


    var info_currses = document.getElementById("info_currentsession");
    if (lldhm.secs != 0) info_currses.innerHTML = lldhm.secs + (lldhm.secs == 1 ? " sekunds" : " sekunders");
    if (lldhm.mins != 0) info_currses.innerHTML = lldhm.mins + (lldhm.mins == 1 ? " minuts" : " minuters");
    if (lldhm.hours != 0) info_currses.innerHTML = lldhm.hours + (lldhm.hours == 1 ? " timmes" : " timmars");
    if (lldhm.days != 0) info_currses.innerHTML = lldhm.days + (lldhm.days == 1 ? " dags" : " dagars");

    //document.getElementById("info_rank").innerHTML = player.bestrank; //fix rank later
    //document.getElementById("info_currentsession").innerHTML = player.bestrank; //fix time later

    main_hex.maxskill = Math.max(player.userStats.life, player.userStats.speed, player.userStats.physicalattack, player.userStats.physicaldefence, player.userStats.magicattack, player.userStats.magicdefence); // max of animate arguments
    player.userStats.color = "rgba(57, 174, 221, 0.65)";
    main_hex.animate([player.userStats]) //{ "life": 25, "speed": 10, "physicalattack": 0, "physicaldefence": 5, "magicattack": 30, "magicdefence": 15, "color": "rgba(0, 0, 0, 0.5)" },

    var pstats = document.getElementById("player_dataStats");

    pstats.getElementsByClassName("char_life")[0].getElementsByTagName('span')[0].innerHTML = player.userStats.life;
    pstats.getElementsByClassName("char_speed")[0].getElementsByTagName('span')[0].innerHTML = player.userStats.speed;
    pstats.getElementsByClassName("char_physA")[0].getElementsByTagName('span')[0].innerHTML = player.userStats.physicalattack;
    pstats.getElementsByClassName("char_physD")[0].getElementsByTagName('span')[0].innerHTML = player.userStats.physicaldefence;
    pstats.getElementsByClassName("char_magA")[0].getElementsByTagName('span')[0].innerHTML = player.userStats.magicattack;
    pstats.getElementsByClassName("char_magD")[0].getElementsByTagName('span')[0].innerHTML = player.userStats.magicdefence;

    var sp_arr = ["char_life", "char_speed", "char_physA", "char_physD", "char_magA", "char_magD"];

    if (player.userStats.skillpoints > 0)
        for (var i = 0; i < sp_arr.length; i++) {
            pstats.getElementsByClassName(sp_arr[i])[0].classList.add("char_sp_up");
            document.getElementsByClassName(sp_arr[i])[0].dataset.num = i +1;
            document.getElementsByClassName(sp_arr[i])[0].onclick = function() {
                console.log(this);
                sendRequest("/players/levelup/" + this.dataset.num, (test, error) => {

                    if (!error) {
                        getPlayer();
                    }
                });
            };
        }
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
