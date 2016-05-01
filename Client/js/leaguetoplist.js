
screens.leaguetoplist.elm.addEventListener("toplist", () => { // Is this the right event?
    var tbl = screens.leaguetoplist.elm.getElementsByClassName("stats-table")[0];
    var bdy = tbl.getElementsByTagName("tbody")[0];
    var ln = document.getElementById("leaguetoplist_leaguename");
    ln.innerHTML = ln.dataset.leaguename;

    var pscore, ind = 1;

    for (var i = 0; i < leaguetoplist.length; i++) {

        if (leaguetoplist[i].userStats.score == pscore) ind--;

        var tdr = document.createElement("td");
        var tdn = document.createElement("td");
        var tds = document.createElement("td");
        var tdl = document.createElement("td");

        tdr.innerHTML = leaguetoplist[i].userStats.rank = ind++;
        tdn.innerHTML = leaguetoplist[i].name;
        tds.innerHTML = leaguetoplist[i].userStats.score;
        tdl.innerHTML = leaguetoplist[i].userStats.level;

        var tr = document.createElement("tr");
        tr.appendChild(tdr);
        tr.appendChild(tdn);
        tr.appendChild(tds);
        tr.appendChild(tdl);

        tr.dataset.data = JSON.stringify(leaguetoplist[i]);

        tr.onclick = function () {
            var data = JSON.parse(this.dataset.data);
            var tdss = this.getElementsByTagName("td");

            var tdr = tdss[0];
            var tdn = tdss[1];
            var tds = tdss[2];
            var tdl = tdss[3];

            if (this.dataset.open == "true") {
                tdr.innerHTML = data.userStats.rank;
                tdn.innerHTML = data.name;
                tds.innerHTML = data.userStats.score;
                tdl.innerHTML = data.userStats.level;
                this.dataset.open = null;
                return;
            }

            this.dataset.open = "true";



            var l =  "<br/>";
            tdr.innerHTML += l + "Bästa rank: " + data.bestrank;
            tds.innerHTML += l + "Vunnit: " + data.totalwins + l + "Förlorat: " + data.totallosses;
            tdn.innerHTML += l + "EXP: " + data.userStats.exp;
        }

        bdy.appendChild(tr);
        pscore = leaguetoplist[i].userStats.score;
    }
});
