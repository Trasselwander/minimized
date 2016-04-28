screens.league.elm.addEventListener("toggled", () => {
    sendRequest("/leagues/list", (test, error) => {
        if (!error) {

            for (var i = 1; i < document.getElementsByClassName("league_name").length; i++) { // removes old league divs
                if (document.getElementsByClassName("league_name").innerHTML != "Tävlingar") {
                    var firstParent = document.getElementsByClassName("league_name")[i].parentElement;
                    firstParent.parentElement.removeChild(firstParent);
                    i--;
                }
            }


            league = JSON.parse(test);
            for (var i = 0; i < league.length; i++) {
                var clone = document.getElementById("shadow_league");
                var newleague = clone.cloneNode(true);
                newleague.getElementsByClassName("league_name")[0].innerHTML = league[i].name;
                newleague.getElementsByClassName("canvas_league")[0].id = "league_canvas_" + i;


                var timenow = new Date().getTime(); // borde göra en funktion för detta
                var remaining =  timenow - league[i].start;
                newleague.getElementsByClassName("stats-table")[0].getElementsByClassName("age")[0].innerHTML = getNiceTime(remaining);
                var remaining = league[i].end - timenow;


                newleague.getElementsByClassName("stats-table")[0].getElementsByClassName("timeleft")[0].innerHTML = getNiceTime(remaining);
                newleague.getElementsByClassName("stats-table")[0].getElementsByClassName("totalplayers")[0].innerHTML = league[i].totalplayers;
                newleague.getElementsByClassName("stats-table")[0].getElementsByClassName("highestlevel")[0].innerHTML = league[i].highestlevel;
                newleague.getElementsByClassName("stats-table")[0].getElementsByClassName("totalfights")[0].innerHTML = league[i].totalfights;
                newleague.getElementsByClassName("stats-table")[0].getElementsByClassName("leader")[0].innerHTML = league[i].leader;

                //var timenow = new Date().getTime();
                //var diff = timenow - player.age;
                //var days = Math.floor(diff / (1000 * 60 * 60 * 24));
                //diff -= days * (1000 * 60 * 60 * 24);
                //var hours = Math.floor(diff / (1000 * 60 * 60));
                //diff -= hours * (1000 * 60 * 60);
                //var mins = Math.floor(diff / (1000 * 60));
                //diff -= mins * (1000 * 60);



                newleague.style = null;

                screens.league.elm.getElementsByClassName("holder")[0].appendChild(newleague);

                setTimeout(function (league, i) {
                    var hex = new hexstat("league_canvas_" + i);
                    hex.maxskill = (league.life + league.speed + league.physicalattack + league.physicaldefence + league.magicattack + league.magicdefence) / 6; // max of animate arguments
                    league.color = "rgba(57, 174, 221, 0.65)";
                    hex.animate([league]);
                }, 1000, league[i], i);



                newleague.getElementsByClassName("joinleague_btn")[0].dataset.lid = league[i].ID;
                newleague.getElementsByClassName("joinleague_btn")[0].onclick = function () {
                    sendRequest("/leagues/join/" + this.dataset.lid);
                    getPlayer();
                }
                if (player.league) {
                    if (league[i].ID == player.league.ID) {
                        newleague.getElementsByClassName("joinleague_btn")[0].innerHTML = "GÅ UR";
                        newleague.getElementsByClassName("joinleague_btn")[0].classList.remove("green");
                        newleague.getElementsByClassName("joinleague_btn")[0].classList.add("orange");
                        newleague.getElementsByClassName("joinleague_btn")[0].onclick = function () {
                            sendRequest("/leagues/leave/" + this.dataset.lid);
                            getPlayer();
                        }
                    }

                }
            }
        }
    });
});
