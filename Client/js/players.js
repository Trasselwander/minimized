
function getPlayer() {
    sendRequest("/players/player", (test, error) => {
        if (!error) {
            player = JSON.parse(test);
            screens.overview.elm.dispatchEvent(new Event("player"));
            console.log(player);
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