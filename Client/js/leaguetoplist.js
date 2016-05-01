

screens.leaguetoplist.elm.addEventListener("loaded", () => {

    
    document.getElementById("leaguetoplist_leaguename").innerHTML = document.getElementById("leaguetoplist_leaguename").dataset.leaguename;

    var pscore = null;
    var ind = 1;

    for (var i = 0; i < leaguetoplist.length; i++) {
        var clone = document.getElementById("shadow_player");
        var newplayer = clone.cloneNode(true);

        newplayer.removeAttribute("id");
        newplayer.classList.add("topleague_player");

        newplayer.getElementsByClassName("leaguetoplist_name")[0].innerHTML = leaguetoplist[i].name;

        if (leaguetoplist[i].userStats.score == pscore) ind--;
        pscore = leaguetoplist[i].userStats.score;

        newplayer.getElementsByClassName("leaguetoplist_rank")[0].innerHTML = ind++;

        newplayer.style = null;
        screens.leaguetoplist.elm.getElementsByClassName("info")[0].appendChild(newplayer);





    }
});