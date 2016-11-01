let allLines = [];
let allVertices = [];

export default class Light extends Phaser.Sprite {
    constructor(game, posX, posY, spriteName, anchorPosition){
        super(game, posX, posY, spriteName);

        this.game.input.addMoveCallback(this.mousePosMove.bind(this));

        this.light = this.game.add.sprite(0, 0, 'bullet-2');
        this.light.anchor.setTo(0.5);

        this.shadowCanvas = this.game.add.bitmapData(this.game.camera.width, this.game.camera.height);
        this.shadowCanvas.context.fillStyle = 'rgb(255, 255, 255)';
        this.shadowCanvas.context.strokeStyle = 'rgb(255, 255, 255)';

        const shadowBitmap = this.game.add.image(0, 0, this.shadowCanvas);
        shadowBitmap.blendMode = Phaser.blendModes.MULTIPLY;

        this.initVertices();
    }

    mousePosMove(pointer) {
        draw.call(this, pointer.position);
        this.light.position = pointer.position;
    }

    initVertices() {
        for(let i = 0; i < this.game.map.blockedObjects.length; i++) {
            const object = this.game.map.blockedObjects[i];
            let objectVertices = [];

            for(let i = 0; i < object.shape.length; i += 2) {
                const point = {x: object.shape[i] + object.x, y: object.shape[i + 1] + object.y};
                objectVertices.push(point);
                allVertices.push(point);
            }

            allLines = allLines.concat(generateLinesFromVertices(objectVertices));
        }

        const borderVertices = [{x: 0, y: 0}, {x: 0, y: 600}, {x: 1100, y: 600}, {x: 1100, y: 0}];

        allVertices = allVertices.concat(borderVertices);
        allLines = allLines.concat(generateLinesFromVertices(borderVertices));

        console.log('allVertices: ', allVertices);
        console.log('allLines: ', allLines);
    }
}


function generateLinesFromVertices(verticesArray) {
    let lines = [];

    for(let i = 0; i < verticesArray.length; i++) {
        const line = {a: {}, b: {}};
        line.a.x = verticesArray[i].x;
        line.a.y = verticesArray[i].y;
        
        if(i === verticesArray.length - 1) {
            line.b.x = verticesArray[0].x;
            line.b.y = verticesArray[0].y;
        } else {
            line.b.x = verticesArray[i + 1].x;
            line.b.y = verticesArray[i + 1].y;
        }

        lines[lines.length] = line;
    }

    return lines;
}

// Find intersection of RAY & SEGMENT
function getIntersection(ray, segment){

    // RAY in parametric: Point + Delta*T1
    var r_px = ray.a.x;
    var r_py = ray.a.y;
    var r_dx = ray.b.x-ray.a.x;
    var r_dy = ray.b.y-ray.a.y;

    // SEGMENT in parametric: Point + Delta*T2
    var s_px = segment.a.x;
    var s_py = segment.a.y;
    var s_dx = segment.b.x-segment.a.x;
    var s_dy = segment.b.y-segment.a.y;

    // Are they parallel? If so, no intersect
    var r_mag = Math.sqrt(r_dx*r_dx+r_dy*r_dy);
    var s_mag = Math.sqrt(s_dx*s_dx+s_dy*s_dy);
    if(r_dx/r_mag==s_dx/s_mag && r_dy/r_mag==s_dy/s_mag){
        // Unit vectors are the same.
        return null;
    }

    // SOLVE FOR T1 & T2
    // r_px+r_dx*T1 = s_px+s_dx*T2 && r_py+r_dy*T1 = s_py+s_dy*T2
    // ==> T1 = (s_px+s_dx*T2-r_px)/r_dx = (s_py+s_dy*T2-r_py)/r_dy
    // ==> s_px*r_dy + s_dx*T2*r_dy - r_px*r_dy = s_py*r_dx + s_dy*T2*r_dx - r_py*r_dx
    // ==> T2 = (r_dx*(s_py-r_py) + r_dy*(r_px-s_px))/(s_dx*r_dy - s_dy*r_dx)
    var T2 = (r_dx*(s_py-r_py) + r_dy*(r_px-s_px))/(s_dx*r_dy - s_dy*r_dx);
    var T1 = (s_px+s_dx*T2-r_px)/r_dx;

    // Must be within parametic whatevers for RAY/SEGMENT
    if(T1<0) return null;
    if(T2<0 || T2>1) return null;

    // Return the POINT OF INTERSECTION
    return {
        x: r_px+r_dx*T1,
        y: r_py+r_dy*T1,
        param: T1
    };

}

function getSightPolygon(sightX, sightY){
    // Get all angles
    var uniqueAngles = [];
    for(var j = 0; j < allVertices.length; j++){
        const vertice = allVertices[j];
        var angle = Math.atan2(vertice.y - sightY, vertice.x - sightX);
        vertice.angle = angle;
        uniqueAngles.push(angle-0.00001,angle,angle+0.00001);
    }

    // RAYS IN ALL DIRECTIONS
    var intersects = [];
    for(var j=0;j<uniqueAngles.length;j++){
        var angle = uniqueAngles[j];

        // Calculate dx & dy from angle
        var dx = Math.cos(angle);
        var dy = Math.sin(angle);

        // Ray from center of screen to mousePos
        var ray = {
            a:{x:sightX,y:sightY},
            b:{x:sightX+dx,y:sightY+dy}
        };

        // Find CLOSEST intersection
        var closestIntersect = null;
        for(var i = 0; i < allLines.length; i++){
            var intersect = getIntersection(ray, allLines[i]);
            if(!intersect) continue;
            if(!closestIntersect || intersect.param < closestIntersect.param){
                closestIntersect = intersect;
            }
        }

        // Intersect angle
        if(!closestIntersect) continue;
        closestIntersect.angle = angle;

        // Add to list of intersects
        intersects.push(closestIntersect);
    }

    // Sort intersects by angle
    intersects = intersects.sort(function(a,b){
        return a.angle-b.angle;
    });

    // Polygon is intersects, in order of angle
    return intersects;
}

function draw(mousePos){
    const ctx = this.shadowCanvas.context;

    // Clear canvas
    ctx.clearRect(0,0,this.game.camera.width,this.game.camera.height);

    ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
    ctx.fillRect(0, 0, this.game.camera.width, this.game.camera.height);

    // Sight Polygons
    var fuzzyRadius = 10;
    var polygons = [getSightPolygon(mousePos.x, mousePos.y)];
    for(var angle=0;angle<Math.PI*2;angle+=(Math.PI*2)/10){
        var dx = Math.cos(angle)*fuzzyRadius;
        var dy = Math.sin(angle)*fuzzyRadius;
        polygons.push(getSightPolygon(mousePos.x + dx, mousePos.y + dy));
    };

    // DRAW AS A GIANT POLYGON
    for(var i=1;i<polygons.length;i++){
        drawPolygon(polygons[i],ctx,"rgba(255,255,255,0.2)");
    }
    drawPolygon(polygons[0],ctx,"rgba(255, 255, 255, 0.5)");
}

function drawPolygon(polygon,ctx,fillStyle){
    ctx.fillStyle = fillStyle;
    ctx.beginPath();
    ctx.moveTo(polygon[0].x,polygon[0].y);
    for(var i=1;i<polygon.length;i++){
        var intersect = polygon[i];
        ctx.lineTo(intersect.x,intersect.y);
    }
    ctx.fill();
}