screens.league.elm.addEventListener("toggled", () => {
    sendRequest("/leagues/list", (test, error) => {
        if (!error) {
            league = JSON.parse(test);
            for (var i = 0; i < league.length; i++) {
                var clone = document.getElementById("shadow_league");
                var newleague = clone.cloneNode(true);
                newleague.getElementsByClassName("league_name")[0].innerHTML = league[i].name;
                newleague.getElementsByClassName("canvas_league")[0].id = "league_canvas_" + i;

                newleague.getElementsByClassName("stats-table")[0].getElementsByClassName("age")[0].innerHTML = (new Date()).getTime() - league[i].start;
                newleague.getElementsByClassName("stats-table")[0].getElementsByClassName("timeleft")[0].innerHTML = (league[i].end - (new Date()).getTime()) > 0 ? league[i].end - (new Date()).getTime() : "Slutad";
                newleague.getElementsByClassName("stats-table")[0].getElementsByClassName("totalplayers")[0].innerHTML = league[i].totalplayers;
                newleague.getElementsByClassName("stats-table")[0].getElementsByClassName("highestlevel")[0].innerHTML = league[i].highestlevel;
                newleague.getElementsByClassName("stats-table")[0].getElementsByClassName("totalfights")[0].innerHTML = league[i].totalfights;
                newleague.getElementsByClassName("stats-table")[0].getElementsByClassName("leader")[0].innerHTML = league[i].leader;

                screens.league.elm.getElementsByClassName("holder")[0].appendChild(newleague);

                setTimeout(function (league, i) {
                    var hex = new hexstat("league_canvas_" + i);
                    hex.maxskill = (league.life + league.speed + league.physicalattack + league.physicaldefence + league.magicattack + league.magicdefence) / 6; // max of animate arguments
                    league.color = "rgba(57, 174, 221, 0.65)";
                    hex.animate([league]);
                }, 1000, league[i], i);
            }
        }
    });
});
