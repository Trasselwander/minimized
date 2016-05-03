﻿var battle;
screens.battle.elm.addEventListener("toggled", () => {
    battle.startLoop();

});
screens.battle.elm.addEventListener("detoggled", () => {
    
    battle.resetAnimation();
});
screens.battle.elm.addEventListener("dead", () => {
    console.log("asdf");
    toggleScreen(screens.attack.elm);
    battle.stopLoop();
});
function attackAny(attackID, target) {
    console.log("attcking any" + attackID);
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
var charWidth = 120,
    charHeight = 150;
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

screens.attack.elm.addEventListener("enemy", () => {
    if (enemy.userStats.life <= 0) var life = 0;
    else var life = enemy.userStats.life;
    battle.enemy.hp = battle.enemy.currentHP = life;

});
screens.overview.elm.addEventListener("player", () => {
    if (player.userStats.life <= 0) var life = 0;
    else var life = player.userStats.life;
    battle.player.hp = battle.player.currentHP = life;

});
function attackCallback(data, attackID) {
    console.log("setting hp", data);

    if (data.playerHP <= 0) battle.player.currentHP = 0;
    else battle.player.currentHP = data.playerHP;

    if (data.enemyHP <= 0) battle.enemy.currentHP = 0;
    else battle.enemy.currentHP = data.enemyHP;

    console.log(battle.player.currentHP / battle.player.hp);
    console.log(battle.enemy.currentHP / battle.enemy.hp);

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