var battle;
screens.battle.elm.addEventListener("toggled", () => {
    battle.startLoop();

});
screens.battle.elm.addEventListener("dead", () => {
    battle.stopLoop();
    toggleScreen(screens.attack.elm);

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
            createParticles(target);
            break;
    }
}
function createFireWork(target, fastAttack, width) { // target == true => attacking enemy, hue == true => fastattack
    if (fastAttack) {
        battle.hue = 50;
        baseSpeed = 8;
    }
    else {
        battle.hue = randomInt(0, 360)
        baseSpeed = 2;
    }
    if (target)
        fireworks.push(new Firework(130, ch / 2 + 30, cw - 120 + randomInt(-charWidth / 2, charWidth / 5), ch / 2 + randomInt(-charHeight / 2, charHeight / 2), 15, baseSpeed, width));
    else
        fireworks.push(new Firework(cw - 100, ch / 2, 150 + randomInt(-charWidth / 2, charWidth / 5), ch / 2 + randomInt(-charHeight / 2, charHeight / 2), 15, baseSpeed, width));
}
function createParticles(target) { //target == true => player buff;
    battle.hue = randomInt(0, 360);
    battle.width = 1;
    var count = randomInt(25, 40);
    while (count--) {
        if (target) particles.push(new Particle(150 + randomInt(-charWidth / 2, charWidth / 5), ch / 2 + randomInt(-charHeight / 2, charHeight / 2), randomInt(4, 16)));
        else particles.push(new Particle(cw - 120 + randomInt(-charWidth / 2, charWidth / 5), ch / 2 + randomInt(-charHeight / 2, charHeight / 2), randomInt(4, 16)));
    }
}

screens.attack.elm.addEventListener("enemy", () => {
    battle.enemy.hp = battle.enemy.currentHP = enemy.userStats.life;

});
screens.overview.elm.addEventListener("player", () => {
    battle.player.hp = battle.player.currentHP = player.userStats.life;

});
function attackCallback(data, attackID) {
    battle.player.currentHP = data.playerHP;
    battle.enemy.currentHP = data.enemyHP;

    if (data.playerFirstRound) {
        attackAny(attackID, true);
        setTimeout(1000, function (attackID) {
            attackAny(attackID, false);
        }, data.enemyAttackType);
    }
    else {
        attackAny(data.enemyAttackType, false);
        setTimeout(1000, function (attackID) {
            attackAny(attackID, true);
        }, attackID);
    }
}

window.addEventListener("load", () => {
    battle = new manageBattleLoop();

    document.getElementById("battle_attack_1").onclick = () => {
        sendRequest("/battle/attack/1"), (test, error) => {
            if (!error) attackCallback(JSON.parse(test), 1);                
        }
    }

    document.getElementById("battle_attack_2").onclick = () => {
        sendRequest("/battle/attack/2"), (test, error) => {
            if (!error) attackCallback(JSON.parse(test), 2);
        }
    }
    document.getElementById("battle_attack_3").onclick = () => {
        sendRequest("/battle/attack/3"), (test, error) => {
            if (!error) attackCallback(JSON.parse(test), 3);
        }
    }
    document.getElementById("battle_attack_4").onclick = () => {
        sendRequest("/battle/attack/4"), (test, error) => {
            if (!error) attackCallback(JSON.parse(test), 4);
        }
    }
});