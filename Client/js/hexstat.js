function hexstat(id) {
    this.canvas = document.getElementById(id);
    if (this.canvas == null) return;
    this.stage = new createjs.Stage(id);
    this.stage.enableDOMEvents(false);

    this.maxskill = 200; //this.level * 4 / 2;
    this.size = this.canvas.width / 2;

    this.test = { time: 0, t:0 };
    var that = this;
    var b = false;

    this.arr = [];
    this.oldarr = [];

    this.data = [];

    this.datalist = [];

    this.tickref;

    this.drawOutline = function () {
        if (this.stage.getChildByName("outline") != null) return;

        var outline = new createjs.Shape();
        outline.name = "outline";
        outline.x = this.canvas.width / 2;
        outline.y = this.canvas.height / 2;
        outline.graphics.beginStroke("#e4e4e4").setStrokeStyle(1).drawPolyStar(0, 0, this.size, 6, 0, -90);
        this.stage.addChild(outline);
    }

    this.drawData = function (life, speed, physattack, physdefence, magattack, magdefence, color) {
        //if (this.stage.getChildByName("data") != null) return;
        var points = [{ x: 0, y: -(Math.min(this.maxskill, life) / this.maxskill * this.size) },
                      { x: (Math.min(this.maxskill, speed) / this.maxskill * this.size) * Math.cos(toRadians(30)), y: -(Math.min(this.maxskill, speed) / this.maxskill * this.size) * Math.sin(toRadians(30)) },
                      { x: (Math.min(this.maxskill, physattack) / this.maxskill * this.size) * Math.cos(toRadians(30)), y: (Math.min(this.maxskill, physattack) / this.maxskill * this.size) * Math.sin(toRadians(30)) },
                      { x: 0, y: (Math.min(this.maxskill, physdefence) / this.maxskill * this.size) },
                      { x: -(Math.min(this.maxskill, magattack) / this.maxskill * this.size) * Math.cos(toRadians(30)), y: (Math.min(this.maxskill, magattack) / this.maxskill * this.size) * Math.sin(toRadians(30)) },
                      { x: -(Math.min(this.maxskill, magdefence) / this.maxskill * this.size) * Math.cos(toRadians(30)), y: -(Math.min(this.maxskill, magdefence) / this.maxskill * this.size) * Math.sin(toRadians(30)) },
                      { x: 0, y: -(Math.min(this.maxskill, life) / this.maxskill * this.size) }];

        var data = new createjs.Shape();
        data.name = "data";
        data.x = this.canvas.width / 2;
        data.y = this.canvas.height / 2;
        data.graphics.beginFill(color || "DeepSkyBlue").moveTo(0, 0);

        for (var p in points) data.graphics.lineTo(points[p].x, points[p].y);

        data.graphics.closePath();

        this.stage.addChild(data);
        this.datalist.push(data);
    }

    this.drawLines = function () {
        if (this.stage.getChildByName("line") != null) return;

        var points = [{ x: 0, y: -this.size },
              { x: this.size * Math.cos(toRadians(30)), y: -this.size * Math.sin(toRadians(30)) },
              { x: this.size * Math.cos(toRadians(30)), y: this.size * Math.sin(toRadians(30)) },
              { x: 0, y: this.size },
              { x: -this.size * Math.cos(toRadians(30)), y: this.size * Math.sin(toRadians(30)) },
              { x: -this.size * Math.cos(toRadians(30)), y: -this.size * Math.sin(toRadians(30)) }];

        for (var i = 0; i < 3; i++) {
            var line = new createjs.Shape();
            line.name = "line";
            line.x = this.canvas.width / 2;
            line.y = this.canvas.height / 2;

            line.graphics.beginStroke("#e4e4e4").setStrokeStyle(1).moveTo(points[i].x, points[i].y).lineTo(points[i + 3].x, points[i + 3].y);

            this.stage.addChild(line);
        }
    }

    this.hardReset = function () {
        b = false;
        this.stage.clear();
        this.stage.removeAllChildren();
        this.arr = [];
    }

    this.animate = function (statsarr) {
        b = false;
        this.arr = statsarr;
        this.drawLines();
        this.drawOutline();
        this.test.t = 0;
    }

    createjs.Ticker.setFPS(60);
    //createjs.Ticker.timingMode = createjs.Ticker.RAF_SYNCHED; // Causes lag, but why?
    createjs.Ticker.addEventListener("tick", tick);


    this.removeData = function () {
        this.datalist.forEach(function (elm) {
            that.stage.removeChild(elm);
        });
        this.datalist = [];
    }
    function tick() {
        if (JSON.stringify(that.arr) != that.oldarr) b = false;

        that.oldarr = JSON.stringify(that.arr);
        that.test.t = Math.min(1 / 120 + that.test.t, 1);

        if (b && that.test.t == 1) return;
        if (that.test.t == 1) b = true;

        that.test.time = createjs.Ease.quintInOut(that.test.t);
        that.removeData();

        statsarr = that.arr;
        for (var i = 0; i < statsarr.length; i++)
            that.drawData(statsarr[i].life * that.test.time, statsarr[i].speed * that.test.time, statsarr[i].physicalattack * that.test.time, statsarr[i].physicaldefence * that.test.time, statsarr[i].magicattack * that.test.time, statsarr[i].magicdefence * that.test.time, statsarr[i].color);

        that.stage.update();
    }
}

function toRadians(angle) {
    return angle * (Math.PI / 180);
}