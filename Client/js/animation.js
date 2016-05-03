// calculate the distance between two points
function calculateDistance(p1x, p1y, p2x, p2y) {
    var xDistance = p1x - p2x,
			yDistance = p1y - p2y;
    return Math.sqrt(Math.pow(xDistance, 2) + Math.pow(yDistance, 2));
}

// create firework
function Firework(sx, sy, tx, ty, speed, width) {
    // actual coordinates
    this.x = sx;
    this.y = sy;
    // starting coordinates
    this.sx = sx;
    this.sy = sy;
    // target coordinates
    this.tx = tx;
    this.ty = ty;

    this.width = width;
    // distance from starting point to target
    this.distanceToTarget = calculateDistance(sx, sy, tx, ty);
    this.distanceTraveled = 0;
    // track the past coordinates of each firework to create a trail effect, increase the coordinate count to create more prominent trails
    this.coordinates = [];
    this.coordinateCount = 3;
    // populate initial coordinate collection with the current coordinates
    while (this.coordinateCount--) {
        this.coordinates.push([this.x, this.y]);
    }
    this.angle = Math.atan2(ty - sy, tx - sx);
    this.speed = speed;
    this.acceleration = 1.05;
    this.brightness = randomDouble(50, 70);
    // circle target indicator radius
    this.targetRadius = 1;
}

// update firework
Firework.prototype.update = function (index) {
    // remove last item in coordinates array
    this.coordinates.pop();
    // add current coordinates to the start of the array
    this.coordinates.unshift([this.x, this.y]);

    // cycle the circle target indicator radius
    if (this.targetRadius < 8) {
        this.targetRadius += 0.3;
    } else {
        this.targetRadius = 1;
    }

    // speed up the firework
    this.speed *= this.acceleration;

    // get the current velocities based on angle and speed
    var vx = Math.cos(this.angle) * this.speed,
			vy = Math.sin(this.angle) * this.speed;
    // how far will the firework have traveled with velocities applied?
    this.distanceTraveled = calculateDistance(this.sx, this.sy, this.x + vx, this.y + vy);

    // if the distance traveled, including velocities, is greater than the initial distance to the target, then the target has been reached
    if (this.distanceTraveled >= this.distanceToTarget) {
        createParticles(this.tx, this.ty, this.brightness, this.width);
        // remove the firework, use the index passed into the update function to determine which to remove
        battle.fireworks.splice(index, 1);
    } else {
        // target not reached, keep traveling
        this.x += vx;
        this.y += vy;
    }
}

// draw firework
Firework.prototype.draw = function (ctx, hue) {
    ctx.beginPath();
    // move to the last tracked coordinate in the set, then draw a line to the current x and y
    ctx.moveTo(this.coordinates[this.coordinates.length - 1][0], this.coordinates[this.coordinates.length - 1][1]);
    ctx.lineTo(this.x, this.y);
    if (this.color) ctx.strokeStyle = 'hsl(' + this.color + ', 100%, ' + this.brightness + '%)';
    else ctx.strokeStyle = 'hsl(' + battle.hue + ', 100%, ' + this.brightness + '%)';

    ctx.lineWidth = this.width;
    ctx.stroke();

    ctx.beginPath();
    // draw the target for this firework with a pulsing circle
    ctx.arc(this.tx, this.ty, this.targetRadius, 0, Math.PI * 2);
    ctx.stroke();
}

// create particle
function Particle(x, y, color, width) {
    this.width = width;
    this.x = x;
    this.y = y;
    // track the past coordinates of each particle to create a trail effect, increase the coordinate count to create more prominent trails
    this.coordinates = [];
    this.coordinateCount = 5;
    while (this.coordinateCount--) {
        this.coordinates.push([this.x, this.y]);
    }
    // set a random angle in all possible directions, in radians
    this.angle = randomDouble(0, Math.PI * 2);
    this.speed = randomDouble(1, 10);
    // friction will slow the particle down
    this.friction = 0.95;
    // gravity will be applied and pull the particle down
    this.gravity = 1;
    // set the hue to a random number +-20 of the overall hue variable
    this.hue = randomDouble(battle.hue - 40, battle.hue + 40);
    this.brightness = color || randomDouble(50, 80);
    this.alpha = 1;
    // set how fast the particle fades out
    this.decay = randomDouble(0.015, 0.03);
}

// update particle
Particle.prototype.update = function (index) {
    // remove last item in coordinates array
    this.coordinates.pop();
    // add current coordinates to the start of the array
    this.coordinates.unshift([this.x, this.y]);
    // slow down the particle
    this.speed *= this.friction;
    // apply velocity
    this.x += Math.cos(this.angle) * this.speed;
    this.y += Math.sin(this.angle) * this.speed + this.gravity;
    // fade out the particle
    this.alpha -= this.decay;

    // remove the particle once the alpha is low enough, based on the passed in index
    if (this.alpha <= this.decay) {
        battle.particles.splice(index, 1);
    }
}

// draw particle
Particle.prototype.draw = function (ctx) {
    ctx.beginPath();
    // move to the last tracked coordinates in the set, then draw a line to the current x and y
    ctx.moveTo(this.coordinates[this.coordinates.length - 1][0], this.coordinates[this.coordinates.length - 1][1]);
    ctx.lineTo(this.x, this.y);
    ctx.strokeStyle = 'hsla(' + this.hue + ', 100%, ' + this.brightness + '%, ' + this.alpha + ')';
    ctx.lineWidth = this.width;

    ctx.stroke();
}

// create particle group/explosion
function createParticles(x, y, color) {
    // increase the particle count for a bigger explosion, beware of the canvas performance hit with the increased this.particles though
    var particleCount = 30;
    while (particleCount--) {
        battle.particles.push(new Particle(x, y, color));
    }
}

// main loop
function manageBattleLoop() {

    this.resetAnimation = function () {
        that.fireworks = [];
        that.particles = [];

        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.fillRect(0, 0, that.cw, that.ch);


        that.player = {
            hp: 0,
            currentHP: 0
        };
        that.enemy = {
            hp: 0,
            currentHP: 0
        };

        playerRatio = 1,
        enemyRatio = 1;
    }

    this.hue = 120;
    var canvas = document.getElementById('battle_animation'),
		ctx = canvas.getContext('2d'),
		cw = canvas.parentElement.offsetWidth,  //window.innerWidth,
		ch = canvas.parentElement.offsetHeight,
		limiterTotal = 5,
		limiterTick = 0,
		timerTotal = 8,
		timerTick = 0,
		mousedown = false,
		mx,
		my;

    this.fireworks = [];
    this.particles = [];
    canvas.width = cw;
    canvas.height = ch;
    this.cw = cw;
    this.ch = ch;

    var playerRatio = 1,
        enemyRatio = 1;
    this.player = {
        hp: 0,
        currentHP: 0
    };
    this.enemy = {
        hp: 0,
        currentHP: 0
    };
    function drawBattleLife() {

        if (playerRatio > that.player.currentHP / that.player.hp) {
            playerRatio -= (that.player.currentHP + 1) / 300;
        }
        if (enemyRatio > that.enemy.currentHP / that.enemy.hp) {
            enemyRatio -= (that.enemy.currentHP + 1) / 300;
        }

        ctx.fillStyle = "rgb(188, 188, 188)";
        ctx.fillRect(32, ch / 2 + 115, 200, 6);
        ctx.fillStyle = "rgb(51, 204, 51)";
        ctx.fillRect(33, ch / 2 + 116, 198 * playerRatio, 2);
        ctx.fillStyle = "rgb(0, 153, 0)";
        ctx.fillRect(33, ch / 2 + 118, 198 * playerRatio, 2);

        ctx.fillStyle = "rgb(188, 188, 188)";
        ctx.fillRect(cw - 232, ch / 2 + 115, 200, 6);
        ctx.fillStyle = "rgb(51, 204, 51)";
        ctx.fillRect(cw - 231, ch / 2 + 116, 198 * enemyRatio, 2);

        ctx.fillStyle = "rgb(0, 153, 0)";
        ctx.fillRect(cw - 231, ch / 2 + 118, 198 * enemyRatio, 2);
    }

    function drawCharacters() {
        //ctx.scale(1, 1);
        var img = new Image();
        img.src = "../img/Character.png";
        ctx.drawImage(img, 0, 0, 400, 400, 25, ch / 2 - 100, 200, 200);

        ctx.save();
        ctx.scale(-1, 1);
        ctx.drawImage(img, 0, 0, 400, 400, -(cw - 25), (ch / 2 - 100), 200, 200); //rör ej!

        ctx.restore();
    }

    var loopCheck = false;
    this.startLoop = function () {
        loopCheck = true;
        loop();
    }
    this.stopLoop = function () {
        loopCheck = false;
    }

    var that = this;
    function loop() {
        // this function will run endlessly with requestAnimationFrame

        if (!loopCheck) return;


        requestAnimFrame(loop);
        drawCharacters();
        ctx.globalCompositeOperation = "source-over";

        drawBattleLife();
        // increase the hue to get different colored this.fireworks over time
        this.hue += 0.15;

        // normally, clearRect() would be used to clear the canvas
        // we want to create a trailing effect though
        // setting the composite operation to destination-out will allow us to clear the canvas at a specific opacity, rather than wiping it entirely
        ctx.globalCompositeOperation = 'destination-out';
        // decrease the alpha property to create more prominent trails
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.fillRect(0, 0, cw, ch);
        // change the composite operation back to our main mode
        // lighter creates bright highlight points as the this.fireworks and this.particles overlap each other
        ctx.globalCompositeOperation = 'lighter';

        // loop over each firework, draw it, update it
        var u = that.fireworks.length;
        while (u--) {
            that.fireworks[u].draw(ctx, hue);
            that.fireworks[u].update(u);
        }

        // loop over each particle, draw it, update it
        var i = that.particles.length;
        while (i--) {
            that.particles[i].draw(ctx);
            that.particles[i].update(i);
        }
        if (i < 1 && playerRatio <= 0 && u < 1 || i < 1 && enemyRatio <= 0 && u < 1) screens.battle.elm.dispatchEvent(new Event('dead'));
    }
}
