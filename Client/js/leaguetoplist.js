

screens.leaguetoplist.elm.addEventListener("loaded", () => {

    for (var i = 0; i < leaguetoplist.length; i++) {
        var clone = document.getElementById("shadow_player");
        var newplayer = clone.cloneNode(true);

        newleague.getElementsByClassName("leaguetoplist_rank")[0].innerHTML = leaguetoplist[i].rank;
        newleague.getElementsByClassName("leaguetoplist_name")[0].innerHTML = leaguetoplist[i].name;

    }
});