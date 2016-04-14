var stage;
function init() {
    stage = new createjs.Stage("main");
    drawStats(20, 5, 40, 10, 10, 5);

}

function drawPart(max, a1, a2, index) {
    var part = new createjs.Shape();
    part.x = 200;
    part.y = 200;

    part.graphics.beginFill("Gray").setStrokeStyle(1).moveTo(0, 0).lineTo(0, -Math.min(max, a1)).lineTo(Math.min(max, a2) * Math.cos(toRadians(60)), -Math.min(max, a2) * Math.sin(toRadians(60))).closePath(); // .lineTo(x - s / 2, y + h).closePath();

    console.log(Math.min(max, a2) * Math.cos(toRadians(60)),-Math.min(max, a2) * Math.sin(toRadians(60)))

    part.rotation = 60 * index;

    stage.addChild(part);
}


function drawStats(life, speed, physattack, physdefence, magattack, magdefence) {
    //var maxskill = level * skillpointsperlevel / 2
    var maxskill = 10 * 4;

    var circle = new createjs.Shape();
    //circle.graphics.beginFill("DeepSkyBlue").drawCircle(0, 0, 50);
    circle.graphics.beginFill("DeepSkyBlue").drawPolyStar(100, 100, maxskill, 6, 0, -90);
    //circle.graphics.beginFill("DarkBlue").drawPolyStar(100, 100, 20, 3, 0).closePath();

    //circle.graphics.beginStroke("Gray").setStrokeStyle(1).moveTo(100, 100).lineTo(100, 100 - Math.min(maxskill, life)); // .lineTo(x - s / 2, y + h).closePath();
    stage.addChild(circle);
    drawPart(maxskill, life, speed, 0);
    //drawPart(maxskill, speed, physattack, 1);
    //drawPart(maxskill, physattack, physdefence, 2);
    //drawPart(maxskill, physdefence, magattack, 3);
    //drawPart(maxskill, magattack, magdefence, 4);
    //drawPart(maxskill, physattack, speed, 1);
    circle.x = 100;
    circle.y = 100;


    // 

    stage.update();
}



function toRadians(angle) {
    return angle * (Math.PI / 180);
}

window.onload = init;
