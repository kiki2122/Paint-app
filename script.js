const canvas = document.getElementById("canvas");
const shape = canvas.getContext("2d");

const triangles = [];

var x = 0;
var y = 0;
var x2 = 0;
var y2 = 0;

var dragOn = null;

function mouseDown(canvas, event) {
    const rect = canvas.getBoundingClientRect();
    x = event.clientX - rect.left - scrollX;
    y = event.clientY - rect.top - scrollY;

    dragOn = checkPointInTriangle(x, y);
}

function mouseUp(canvas, event) {
    if (dragOn !== null) {
        dragOn = null;
    } else {
        const rect = canvas.getBoundingClientRect();
        x2 = event.clientX - rect.left - scrollX;
        y2 = event.clientY - rect.top - scrollY;
    
        if (x != x2 && y != y2) {
            triangle();
        }
    }
}

function mouseMove(canvas, event) {
    if (dragOn !== null) {
        var x3, y3;
        const rect = canvas.getBoundingClientRect();
        x3 = event.clientX - rect.left - scrollX;
        y3 = event.clientY - rect.top - scrollY;

        triangles[dragOn].x1 -= x - x3;
        triangles[dragOn].x2 -= x - x3;
        triangles[dragOn].x3 -= x - x3;
        triangles[dragOn].y1 -= y - y3;
        triangles[dragOn].y2 -= y - y3;
        triangles[dragOn].y3 -= y - y3;

        x = x3;
        y = y3;

        reDraw();
    }
}

function deleteTriangle(canvas, event){
    var x3, y3;
    const rect = canvas.getBoundingClientRect();
    x3 = event.clientX - rect.left - scrollX;
    y3 = event.clientY - rect.top - scrollY;

    var index = checkPointInTriangle(x3, y3);

    if (index !== null) {
        triangles.splice(index, 1);
        reDraw();
    }
}

canvas.addEventListener('mouseup', function(e) {
    mouseUp(canvas, e)
});

canvas.addEventListener('mousedown', function(e) {
    mouseDown(canvas, e)
});

canvas.addEventListener('mousemove', function(e) {
    mouseMove(canvas, e)
});

canvas.addEventListener('dblclick', function(e) {
    deleteTriangle(canvas, e)
});

function triangle(param = {}){
    shape.beginPath();
    shape.strokeStyle = "black";
    shape.lineWidth = 0.5;

    if (Object.keys(param).length > 0) {
        shape.fillStyle = param.color; 
        shape.moveTo(param.x1, param.y1);
        shape.lineTo(param.x2, param.y2);
        shape.lineTo(param.x3, param.y3);
        shape.lineTo(param.x1, param.y1);
    } else {
        var triangle = {
            x1: x + (x2 - x) / 2,
            y1: y,
            x2: x,
            y2: y2,
            x3: x2,
            y3: y2,
            color: randomColor()
        };
        triangles.unshift(triangle);

        shape.fillStyle = triangle.color; 
        shape.moveTo(triangle.x1, triangle.y1);
        shape.lineTo(triangle.x2, triangle.y2);
        shape.lineTo(triangle.x3, triangle.y3);
        shape.lineTo(triangle.x1, triangle.y1);
    }

    shape.stroke();
    shape.fill();
    shape.closePath();
}

function randomColor() {
    let colors = [
        "blue",
        "yellow",
        "pink",
        "orange",
        "black",
        "violet",
        "red",
        "green",
        "brown"
    ];

    let random = Math.floor(Math.random() * colors.length);
    return colors[random];
}

function clear() {
    shape.clearRect(0, 0, canvas.width, canvas.height);
}

function clearCanvas() {
    clear(triangle);
}

function checkPointInTriangle(x4, y4) {
    for (var i = 0; i < triangles.length; i++) {
        var area = triangleArea(triangles[i].x1, triangles[i].y1, triangles[i].x2, triangles[i].y2, triangles[i].x3, triangles[i].y3);
        var area1 = triangleArea(x4, y4, triangles[i].x2, triangles[i].y2, triangles[i].x3, triangles[i].y3);
        var area2 = triangleArea(triangles[i].x1, triangles[i].y1, x4, y4, triangles[i].x3, triangles[i].y3);
        var area3 = triangleArea(triangles[i].x1, triangles[i].y1, triangles[i].x2, triangles[i].y2, x4, y4);

        if (area == area1 + area2 + area3) {
            return i;
        }
    }

    return null;
}

function triangleArea(a1, b1, a2, b2, a3, b3) {
    return Math.abs((a1 * (b2 - b3) + a2 * (b3 - b1) + a3 * (b1 - b2)) / 2.0);
}

function reDraw() {
    clearCanvas();

    for (var i = triangles.length - 1; i >= 0; i--) {
        triangle(triangles[i]);
    }
}