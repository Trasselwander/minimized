﻿
function getPlayer() {
    sendRequest("/players/player", (test, error) => {
        if (!error) {
            player = JSON.parse(test);
            screens.overview.elm.dispatchEvent(new Event("player"));
        }
    });


}
