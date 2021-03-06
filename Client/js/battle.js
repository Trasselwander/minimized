﻿var battle,
    charWidth = 120,
    charHeight = 150;

screens.battle.elm.addEventListener("toggled", () => {
    battle.startLoop();
});

screens.battle.elm.addEventListener("detoggled", () => {
    battle.resetAnimation();
});

api.elm.addEventListener("dead", () => {
    if (battle.enemy.currentHP < battle.player.currentHP) swal("Toppen", "Du vann!", "success")
    else swal("Oops...", "Du förlorade!", "error");

    toggleScreen(screens.attack.elm);
    battle.stopLoop();
});

function attackAny(attackID, target) {
    switch (attackID) {
        case 1:
            createFireWork(target, false, 15);
            break;
        case 2:
            createFireWork(target, false, 40);
            break;
        case 3:
            createFireWork(target, true, 5);
            break;
        case 4:
            createBattleParticles(target);
            break;
    }
}

function createFireWork(target, fastAttack, width) { // target == true => attacking enemy, hue == true => fastattack
    if (fastAttack) {
        battle.hue = 50;
        baseSpeed = 8;
    }
    else {
        battle.hue = randomDouble(0, 360)
        baseSpeed = 2;
    }
    if (target)
        battle.fireworks.push(new Firework(130, battle.ch / 2 + 30, battle.cw - 120 + randomDouble(-charWidth / 2, charWidth / 5), battle.ch / 2 + randomDouble(-charHeight / 2, charHeight / 2), baseSpeed, width));
    else
        battle.fireworks.push(new Firework(battle.cw - 100, battle.ch / 2, 150 + randomDouble(-charWidth / 2, charWidth / 5), battle.ch / 2 + randomDouble(-charHeight / 2, charHeight / 2), baseSpeed, width));
}
function createBattleParticles(target) { //target == true => player buff;
    battle.hue = randomDouble(0, 360);
    battle.width = 1;
    var count = 30;
    while (count--) {
        if (target) battle.particles.push(new Particle(150 + randomDouble(-charWidth / 2, charWidth / 5), battle.ch / 2 + randomDouble(-charHeight / 2, charHeight / 2), randomDouble(4, 16), 1));
        else battle.particles.push(new Particle(battle.cw - 120 + randomDouble(-charWidth / 2, charWidth / 5), battle.ch / 2 + randomDouble(-charHeight / 2, charHeight / 2), randomDouble(4, 16), 1));
    }
}

api.elm.addEventListener("enemy", () => {
    enemy.userStats.life = Math.max(enemy.userStats.life, 0);
    battle.enemy.hp = battle.enemy.currentHP = enemy.userStats.life;
});

api.elm.addEventListener("player", () => {
    if (player == null || player.userStats == null) return;

    player.userStats.life = Math.max(player.userStats.life, 0);
    battle.player.hp = battle.player.currentHP = player.userStats.life;
});

function attackCallback(data, attackID) {

    if (data.playerHP <= 0) battle.player.currentHP = 0;
    else battle.player.currentHP = data.playerHP;

    if (data.enemyHP <= 0) battle.enemy.currentHP = 0;
    else battle.enemy.currentHP = data.enemyHP;


    if (!data.playerFirstRound && data.playerHP < 1) 
        attackAny(attackID, false);
    else if (data.playerFirstRound && data.enemyHP < 1) 
        attackAny(attackID, true);
    else {

        if (data.playerFirstRound) {
            attackAny(attackID, true);
            setTimeout(function (attackID) {
                attackAny(attackID, false);
            }, 1000, data.enemyAttackType);
        }
        else {
            attackAny(data.enemyAttackType, false);
            setTimeout(function (attackID) {
                attackAny(attackID, true);
            }, 1000, attackID);
        }

    }
}

window.addEventListener("load", () => {
    battle = new manageBattleLoop();

    document.getElementById("battle_attack_1").onclick = () => {
        sendRequest("/battle/attack/1", (test, error) => {
            if (!error) attackCallback(JSON.parse(test), 1);
        });
    }

    document.getElementById("battle_attack_2").onclick = () => {
        sendRequest("/battle/attack/2", (test, error) => {
            if (!error) attackCallback(JSON.parse(test), 2);
        });
    }
    document.getElementById("battle_attack_3").onclick = () => {
        sendRequest("/battle/attack/3", (test, error) => {
            if (!error) attackCallback(JSON.parse(test), 3);
        });
    }
    document.getElementById("battle_attack_4").onclick = () => {
        sendRequest("/battle/attack/4", (test, error) => {
            if (!error) attackCallback(JSON.parse(test), 4);
        });
    }
});