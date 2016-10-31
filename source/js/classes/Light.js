export default class Light extends Phaser.Sprite {
    constructor(game, posX, posY, spriteName, anchorPosition){
        super(game, posX, posY, spriteName);

        this.game.input.addMoveCallback(this.mousePosMove.bind(this));

        this.light = this.game.add.sprite(0, 0, 'bullet-2');
        this.light.anchor.setTo(0.5);

        this.lightCanvas = this.game.add.bitmapData(this.game.camera.width, this.game.camera.height);
        this.lightCanvas.context.fillStyle = 'rgb(255, 255, 255)';
        this.lightCanvas.context.strokeStyle = 'rgb(255, 255, 255)';

        const lightBitmap = this.game.add.image(0, 0, this.lightCanvas);
        lightBitmap.blendMode = Phaser.blendModes.MULTIPLY;

        // this.game.player.mask = lightBitmap;
    }

    mousePosMove(pointer) {
        draw.call(this, pointer.position);
        this.light.position = pointer.position;
    }
}

// Find intersection of RAY & SEGMENT
function getIntersection(ray,segment){

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

    // Get all unique points
    var points = (function(segments){
        var a = [];
        segments.forEach(function(seg){
            a.push(seg.a,seg.b);
        });
        return a;
    })(segments);

    var uniquePoints = (function(points){
        var set = {};
        return points.filter(function(p){
            var key = p.x+","+p.y;
            if(key in set){
                return false;
            }else{
                set[key]=true;
                return true;
            }
        });
    })(points);

    // Get all angles
    var uniqueAngles = [];
    for(var j=0;j<uniquePoints.length;j++){
        var uniquePoint = uniquePoints[j];
        var angle = Math.atan2(uniquePoint.y-sightY,uniquePoint.x-sightX);
        uniquePoint.angle = angle;
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
        for(var i=0;i<segments.length;i++){
            var intersect = getIntersection(ray,segments[i]);
            if(!intersect) continue;
            if(!closestIntersect || intersect.param<closestIntersect.param){
                closestIntersect=intersect;
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

///////////////////////////////////////////////////////

// DRAWING
function draw(mousePos){
    const ctx = this.lightCanvas.context;

    // Clear canvas
    ctx.clearRect(0,0,this.game.camera.width,this.game.camera.height);

    ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
    ctx.fillRect(0, 0, this.game.camera.width, this.game.camera.height);

    // Sight Polygons
    var fuzzyRadius = 10;
    var polygons = [getSightPolygon(mousePos.x,mousePos.y)];
    for(var angle=0;angle<Math.PI*2;angle+=(Math.PI*2)/10){
        var dx = Math.cos(angle)*fuzzyRadius;
        var dy = Math.sin(angle)*fuzzyRadius;
        polygons.push(getSightPolygon(mousePos.x+dx,mousePos.y+dy));
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

// LINE SEGMENTS
var segments = [

    // Border
    {a:{x:0,y:0}, b:{x:840,y:0}},
    {a:{x:840,y:0}, b:{x:840,y:360}},
    {a:{x:840,y:360}, b:{x:0,y:360}},
    {a:{x:0,y:360}, b:{x:0,y:0}},

    // Polygon #1
    {a:{x:100,y:150}, b:{x:120,y:50}},
    {a:{x:120,y:50}, b:{x:200,y:80}},
    {a:{x:200,y:80}, b:{x:140,y:210}},
    {a:{x:140,y:210}, b:{x:100,y:150}},

    // Polygon #2
    {a:{x:100,y:200}, b:{x:120,y:250}},
    {a:{x:120,y:250}, b:{x:60,y:300}},
    {a:{x:60,y:300}, b:{x:100,y:200}},

    // Polygon #3
    {a:{x:200,y:260}, b:{x:220,y:150}},
    {a:{x:220,y:150}, b:{x:300,y:200}},
    {a:{x:300,y:200}, b:{x:350,y:320}},
    {a:{x:350,y:320}, b:{x:200,y:260}},

    // Polygon #4
    {a:{x:540,y:60}, b:{x:560,y:40}},
    {a:{x:560,y:40}, b:{x:570,y:70}},
    {a:{x:570,y:70}, b:{x:540,y:60}},

    // Polygon #5
    {a:{x:650,y:190}, b:{x:760,y:170}},
    {a:{x:760,y:170}, b:{x:740,y:270}},
    {a:{x:740,y:270}, b:{x:630,y:290}},
    {a:{x:630,y:290}, b:{x:650,y:190}},

    // Polygon #6
    {a:{x:600,y:95}, b:{x:780,y:50}},
    {a:{x:780,y:50}, b:{x:680,y:150}},
    {a:{x:680,y:150}, b:{x:600,y:95}}

];