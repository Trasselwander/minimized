

function hexstat(id) {
    this.canvas = document.getElementById(id);
    if (this.canvas == null) return;
    this.stage = new createjs.Stage(id);

    this.level = 20;
    this.maxskill = 200; //this.level * 4 / 2;

    this.drawOutline = function () {
        if (this.stage.getChildByName("outline") != null) return;

        var outline = new createjs.Shape();
        outline.name = "outline";
        outline.x = this.canvas.width / 2;
        outline.y = this.canvas.height / 2;
        outline.graphics.beginStroke("#e4e4e4").setStrokeStyle(1).drawPolyStar(0, 0, this.maxskill, 6, 0, -90);
        this.stage.addChild(outline);
    }

    this.drawData = function (life, speed, physattack, physdefence, magattack, magdefence) {
        //if (this.stage.getChildByName("data") != null) return;

        var points = [{ x: 0, y: -Math.min(this.maxskill, life) },
                      { x: Math.min(this.maxskill, speed) * Math.cos(toRadians(30)), y: -Math.min(this.maxskill, speed) * Math.sin(toRadians(30)) },
                      { x: Math.min(this.maxskill, physattack) * Math.cos(toRadians(30)), y: Math.min(this.maxskill, physattack) * Math.sin(toRadians(30)) },
                      { x: 0, y: Math.min(this.maxskill, physdefence) },
                      { x: -Math.min(this.maxskill, magattack) * Math.cos(toRadians(30)), y: Math.min(this.maxskill, magattack) * Math.sin(toRadians(30)) },
                      { x: -Math.min(this.maxskill, magdefence) * Math.cos(toRadians(30)), y: -Math.min(this.maxskill, magdefence) * Math.sin(toRadians(30)) },
                      { x: 0, y: -Math.min(this.maxskill, life) }];

        if (this.data) this.stage.removeChild(this.data); // I don't know if it is possible to edit moveTo cordinates.

        data = new createjs.Shape();
        data.name = "data";
        data.x = this.canvas.width / 2;
        data.y = this.canvas.height / 2;
        data.graphics.beginFill("DeepSkyBlue").moveTo(0, 0);

        for (var p in points) data.graphics.lineTo(points[p].x, points[p].y);

        data.graphics.closePath();

        this.stage.addChild(data);
        this.data = data;
    }

    this.drawLines = function () {
        if (this.stage.getChildByName("line") != null) return;

        var points = [{ x: 0, y: -this.maxskill },
              { x: this.maxskill * Math.cos(toRadians(30)), y: -this.maxskill * Math.sin(toRadians(30)) },
              { x: this.maxskill * Math.cos(toRadians(30)), y: this.maxskill * Math.sin(toRadians(30)) },
              { x: 0, y: this.maxskill },
              { x: -this.maxskill * Math.cos(toRadians(30)), y: this.maxskill * Math.sin(toRadians(30)) },
              { x: -this.maxskill * Math.cos(toRadians(30)), y: -this.maxskill * Math.sin(toRadians(30)) }];

        for (var i = 0; i < 3; i++) {
            var line = new createjs.Shape();
            line.name = "line";
            line.x = this.canvas.width / 2;
            line.y = this.canvas.height / 2;

            line.graphics.beginStroke("#e4e4e4").setStrokeStyle(1).moveTo(points[i].x, points[i].y).lineTo(points[i + 3].x, points[i + 3].y);

            this.stage.addChild(line);
        }
    }

    this.draw = function (life, speed, physattack, physdefence, magattack, magdefence) {
        this.drawLines();
        this.drawOutline();
        this.drawData(life, speed, physattack, physdefence, magattack, magdefence);

        this.stage.update();
    }

    this.animate = function (life, speed, physattack, physdefence, magattack, magdefence) {
        this.stage.clear();
        this.stage.removeAllChildren();
        this.drawLines();
        this.drawOutline();

        var test = { time: 0 };
        var that = this;
        createjs.Tween.get(test).to({ time: 1 }, 2000, createjs.Ease.quintInOut).addEventListener("change", function () {
            that.drawData(life * test.time, speed * test.time, physattack * test.time, physdefence * test.time, magattack * test.time, magdefence * test.time);
            that.stage.update();
        });
    }
}


function toRadians(angle) {
    return angle * (Math.PI / 180);
}