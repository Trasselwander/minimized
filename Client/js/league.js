
var leauge_hex = {};
var endedcurrent = false;

screens.league.elm.addEventListener("toggled", () => {
    for (var i in leauge_hex)
        leauge_hex[i].arr = [];
});

screens.league.elm.addEventListener("detoggled", () => {
    var lnames = document.getElementsByClassName("league_name");
    for (var i = 1; i < lnames.length; i++) { // removes old league divs
        var firstParent = lnames[i].parentElement;
        firstParent.parentElement.removeChild(firstParent);
        i--;
    }
});


api.elm.addEventListener("leaguelist", function () {

    var lnames = document.getElementsByClassName("league_name");
    for (var i = 1; i < lnames.length; i++) { // removes old league divs
        var firstParent = lnames[i].parentElement;
        firstParent.parentElement.removeChild(firstParent);
        i--;
    }

    leauge_hex = {}; // Hopefully this will destroy the instances of hexstats and make GC remove them from memory.

    [].forEach.call(document.getElementById("shadow_league").getElementsByClassName("material-btn"), function (b) { b.dataset.material = null; });

    for (var i = 0; i < leagues.length; i++) {
        if (leagues[i].end < new Date().getTime())
            if (!endedcurrent) continue;

        if (leagues[i].end > new Date().getTime())
            if (endedcurrent) continue;

        var clone = document.getElementById("shadow_league");
        var newleague = clone.cloneNode(true);
        newleague.getElementsByClassName("league_name")[0].innerHTML = leagues[i].name;
        newleague.getElementsByClassName("canvas_league")[0].id = "league_canvas_" + i;

        var newstatstbl = newleague.getElementsByClassName("stats-table")[0];
        var timenow = new Date().getTime(); // borde göra en funktion för detta

        newstatstbl.getElementsByClassName("age")[0].innerHTML = getNiceTime(timenow - leagues[i].start, true);
        newstatstbl.getElementsByClassName("timeleft")[0].innerHTML = getNiceTime(leagues[i].end - timenow);

        newstatstbl.getElementsByClassName("totalplayers")[0].innerHTML = leagues[i].totalplayers;
        newstatstbl.getElementsByClassName("highestlevel")[0].innerHTML = leagues[i].highestlevel;
        newstatstbl.getElementsByClassName("totalfights")[0].innerHTML = leagues[i].totalfights;
        newstatstbl.getElementsByClassName("leader")[0].innerHTML = leagues[i].leader;

        newleague.style = null;
        screens.league.elm.getElementsByClassName("holder")[0].appendChild(newleague);

        leagues[i].color = "rgba(57, 174, 221, 0.65)";

        leauge_hex["league_canvas_" + i] = new hexstat("league_canvas_" + i);
        leauge_hex["league_canvas_" + i].maxskill = Math.max(leagues[i].life, leagues[i].speed, leagues[i].physicalattack, leagues[i].physicaldefence, leagues[i].magicattack, leagues[i].magicdefence);
        leauge_hex["league_canvas_" + i].animate([leagues[i]]);

        newleague.getElementsByClassName("joinleague_btn")[0].dataset.lid = leagues[i].ID;
        newleague.getElementsByClassName("joinleague_btn")[0].dataset.lname = leagues[i].name;

        newleague.getElementsByClassName("joinleague_btn")[0].onclick = function () {
            sendRequest("/leagues/join/" + this.dataset.lid, (text, error) => {
                if (!error) {
                    toggleScreen(screens.overview.elm);
                    swal({
                        title: "Grattis!",
                        text: "Du gick med i tävlingen " + this.dataset.lname + "!",
                        type: "success",
                    });
                }
            });
        }


        var tl = newleague.getElementsByClassName("toplist_btn")[0];
        tl.dataset.lid = leagues[i].ID;
        tl.dataset.leaguename = leagues[i].name;
        tl.onclick = function () {
            api.getLeagueTop(this.dataset.lid);
            document.getElementById("leaguetoplist_leaguename").dataset.leaguename = this.dataset.leaguename;
            toggleScreen(screens.leaguetoplist.elm);
        }

        if (player.league && leagues[i].ID == player.league.ID) {
            var jl = newleague.getElementsByClassName("joinleague_btn")[0];

            jl.innerHTML = "GÅ UR";
            jl.classList.remove("green");
            jl.classList.add("orange");
            jl.dataset.leaguename = leagues[i].name;
            jl.onclick = function () {
                var name = this.dataset.leaguename;
                swal({
                    title: "Are you sure?",
                    text: "Leaving a league will remove your progress in the current one!",
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#DD6B55",
                    confirmButtonText: "Yes, leave!",
                    closeOnConfirm: false
                }, function () {
                    sendRequest("/leagues/leave", (text, error) => {
                        if (!error) {
                            toggleScreen(screens.overview.elm);
                            swal({
                                title: "Grattis!",
                                text: "Du lämnade tävlingen " + name + "!",
                                type: "success",
                            });
                        }
                    });
                });

            }
        }
    }
    UpdateButtons();
});

screens.league.elm.addEventListener("toggled", () => {
    api.getLeagueList();
});




window.addEventListener("load", () => {
    document.getElementById("endedcurrent_btn").onclick = function () {
        if (endedcurrent)
            this.innerHTML = "SLUTADE";
        else
            this.innerHTML = "PÅGÅENDE";

        endedcurrent = !endedcurrent;
        api.elm.dispatchEvent(new Event("leaguelist"));
    }
});