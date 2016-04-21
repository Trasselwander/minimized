
function getPlayers() {
    sendRequest("/players/list", (test, error) => {
        if (!error) {
            players = JSON.parse(test).reverse();
            screens.overview.elm.dispatchEvent(new Event("players"));
        }
    });
}
