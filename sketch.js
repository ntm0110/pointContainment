points = [];

function setup() {
    createCanvas(1200, 1200);
}

function draw() {
    if (mouseIsPressed) {
        fill(0);
        points.append({ x: mouseX, y: mouseY, w: 80, h: 80 });
    }

    points.push((element) => {
        ellipse(element.x, element.y, element.w, element.h);
    });
    // ellipse(mouseX, mouseY, 80, 80);
}
