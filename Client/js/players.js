
function getPlayer() {
    sendRequest("/players/player", (test, error) => {
        if (!error) {
            player = JSON.parse(test);
            screens.overview.elm.dispatchEvent(new Event("player"));
        }
    });
}

function getEnemy() {
    sendRequest("/players/enemy", (test, error) => {
        if (!error) {
            enemy = JSON.parse(test);
            screens.attack.elm.dispatchEvent(new Event("enemy"));
        }
    });
}

function getTop10() {
    if (!player.LID) {
        screens.overview.elm.dispatchEvent(new Event("top10"));
        return;
    }

    sendRequest("/leagues/top10/" + player.LID, (test, error) => {
        if (!error) {
            top10 = JSON.parse(test);
            screens.overview.elm.dispatchEvent(new Event("top10"));
        }
    });
}