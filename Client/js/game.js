api = { /*For everything that returns data used in multipleplaces, aka setting a global variable inside netwrok call ex. var=json.parse(response)*/
    elm: document.getElementById('game'),

    getPlayer: (fn) => {
        sendRequest("/players/player", (text, error) => {
            player = error ? null : JSON.parse(text);
            if (typeof fn === "function" && !error) fn();

            api.elm.dispatchEvent(new Event("player"));
        });
    },

    getEnemy: (fn) => {
        sendRequest("/players/enemy", (text, error) => {
            enemy = error ? null : JSON.parse(text);
            if (typeof fn === "function" && !error) fn();

            api.elm.dispatchEvent(new Event("enemy"));
        });
    },

    getTop10: (fn) => {
        if (!player.LID) {
            top10 = null;
            api.elm.dispatchEvent(new Event("top10"));
            return;
        }

        sendRequest("/leagues/top10/" + player.LID, (text, error) => {
            top10 = error ? null : JSON.parse(text);
            if (typeof fn === "function" && !error) fn();

            api.elm.dispatchEvent(new Event("top10"));
        });
    },

    getLeagueTop: (LID, fn) => {
        if (!LID) return;

        sendRequest("/leagues/top/" + LID, (text, error) => {
            leaguetoplist = error ? null : JSON.parse(text);
            if (typeof fn === "function" && !error) fn();

            api.elm.dispatchEvent(new Event("leaguetop"));
        });
    },

    getLeagueList: (fn) => {
        sendRequest("/leagues/list", (text, error) => {
            leagues = error ? null : JSON.parse(text);
            if (typeof fn === "function" && !error) fn();

            api.elm.dispatchEvent(new Event("leaguelist"));
        });
    },

    getBattleInit: (fn) => {
        sendRequest("/battle/init/" + enemy.ID, (test, error) => {
            battleStats = error ? null : JSON.parse(test);
            if (typeof fn === "function" && !error) fn();

            api.elm.dispatchEvent(new Event("battleinit"));
        });
    },


}

screens = {
    login: {
        elm: document.getElementById("login"),
        visible: false,
    },
    register: {
        elm: document.getElementById("register"),
        visible: false,
    },
    overview: {
        elm: document.getElementById("overview"),
        visible: false,
    },
    attack: {
        elm: document.getElementById("attack"),
        visible: false,
    },
    league: {
        elm: document.getElementById("league"),
        visible: false,
    },
    leaguetoplist: {
        elm: document.getElementById("leaguetoplist"),
        visible: false,
    },
    battle: {
        elm: document.getElementById("battle"),
        visible: false,
    },
    exp: {
        elm: document.getElementById("exp"),
        visible: false,
    }
}