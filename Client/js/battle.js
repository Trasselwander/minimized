screens.battle.elm.addEventListener("toggled", () => {

});

window.addEventListener("load", () => {
    document.getElementById("battle_attack_1").onclick = () => {
        sendRequest("/battle/attack/1"), (test, error) => {
            if (!error) {
                battleStats = JSON.parse(test);
                normalAttack();
            }
        }
    }

    document.getElementById("battle_attack_2").onclick = () => {
        sendRequest("/battle/attack/2"), (test, error) => {
            if (!error) {
                battleStats = JSON.parse(test);
                magicAttack();
            }
        }
    }
    document.getElementById("battle_attack_3").onclick = () => {
        sendRequest("/battle/attack/3"), (test, error) => {
            if (!error) {
                battleStats = JSON.parse(test);
                fastAttack();
            }
        }
    }
    document.getElementById("battle_attack_4").onclick = () => {
        sendRequest("/battle/attack/4"), (test, error) => {
            if (!error) {
                battleStats = JSON.parse(test);
                defence();
            }
        }
    }
});