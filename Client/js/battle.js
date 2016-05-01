screens.battle.elm.addEventListener("init", () => {

});

window.addEventListener("load", () => {
    document.getElementById("battle_attack_1").onclick = () => {
        normalAttack();
    }
    document.getElementById("battle_attack_2").onclick = () => {
        magicAttack();
    }
    document.getElementById("battle_attack_3").onclick = () => {
        fastAttack();
    }
    document.getElementById("battle_attack_4").onclick = () => {
        defence();
    }



});