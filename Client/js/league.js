
var leauge_hex = {};

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
            leauge_hex = {}; // Hopefully this will destroy the instances of hexstats and make GC remove them from memory.

            league = JSON.parse(test);
            for (var i = 0; i < league.length; i++) {
                var clone = document.getElementById("shadow_league");
                var newleague = clone.cloneNode(true);
                newleague.getElementsByClassName("league_name")[0].innerHTML = league[i].name;
                newleague.getElementsByClassName("canvas_league")[0].id = "league_canvas_" + i;

                var newstatstbl = newleague.getElementsByClassName("stats-table")[0];
                var timenow = new Date().getTime(); // borde göra en funktion för detta

                newstatstbl.getElementsByClassName("age")[0].innerHTML = getNiceTime(timenow - league[i].start);
                newstatstbl.getElementsByClassName("timeleft")[0].innerHTML = getNiceTime(league[i].end - timenow);

                newstatstbl.getElementsByClassName("totalplayers")[0].innerHTML = league[i].totalplayers;
                newstatstbl.getElementsByClassName("highestlevel")[0].innerHTML = league[i].highestlevel;
                newstatstbl.getElementsByClassName("totalfights")[0].innerHTML = league[i].totalfights;
                newstatstbl.getElementsByClassName("leader")[0].innerHTML = league[i].leader;

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

                league.color = "rgba(57, 174, 221, 0.65)";

                leauge_hex["league_canvas_" + i] = new hexstat("league_canvas_" + i);
                leauge_hex["league_canvas_" + i].maxskill = (league.life + league.speed + league.physicalattack + league.physicaldefence + league.magicattack + league.magicdefence) / 6; // max of animate arguments
                leauge_hex["league_canvas_" + i].animate([league]);

                newleague.getElementsByClassName("joinleague_btn")[0].dataset.lid = league[i].ID;
                newleague.getElementsByClassName("joinleague_btn")[0].dataset.lname = league[i].name;

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

                if (player.league) {
                    if (league[i].ID == player.league.ID) {
                        var jl = newleague.getElementsByClassName("joinleague_btn")[0];

                        jl.innerHTML = "GÅ UR";
                        jl.classList.remove("green");
                        jl.classList.add("orange");
                        jl.onclick = function () {
                            sendRequest("/leagues/leave", () => {
                                if (!error) {
                                    toggleScreen(screens.overview.elm);
                                    swal({
                                        title: "Grattis!",
                                        text: "Du lämnade tävlingen " + this.dataset.lname + "!",
                                        type: "success",
                                    });
                                }
                            });
                        }
                    }
                }
            }
        }
    });
});
