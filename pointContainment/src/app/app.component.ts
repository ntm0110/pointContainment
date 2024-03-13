import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import p5 from 'p5';
import { Circle } from './models/circle';
import { getRandomFloat } from './utils/random';
import { Rectangle } from './models/rectangle';
import {
  degreesToRadians,
  radians,
  radiansToDegrees,
  rotatePointAroundOrigin,
} from './utils/mathHelpers';

const circleOpacity = 0.05;

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  randomAngle = degreesToRadians(getRandomFloat(0, 360));
  circles: Circle[] = [];
  containmentArea: Rectangle = new Rectangle(0, 0, 0, 0);

  screenWidth = window.innerWidth;
  screenHeight = window.innerHeight;
  boundingPlane = {
    minX: -this.screenWidth / 2,
    maxX: this.screenWidth / 2,
    minY: -this.screenHeight / 2,
    maxY: this.screenHeight / 2,
  };
  doOnce = true;

  ngOnInit() {
    console.log(
      `Angle of rotation: rad: ${this.randomAngle} deg: ${radiansToDegrees(
        this.randomAngle
      )}`
    );
    const sketch = (scene: p5) => {
      scene.setup = () => {
        scene.createCanvas(this.screenWidth, this.screenHeight);
        scene.background('#8CC4A8');
      };

      scene.mouseDragged = () => {
        // this.addCircle(scene);
      };

      scene.mouseClicked = () => {
        // this.addCircle(scene);
        const mousePos = this.getAdjustedMousePos(scene);
        scene.text(`(${mousePos.x}, ${mousePos.y})`, mousePos.x, mousePos.y);
      };

      scene.draw = () => {
        // center origin
        // scene.translate(this.screenWidth / 2, this.screenHeight / 2);
        // flip y so up is positive
        // scene.scale(1, -1);

        if (this.doOnce) {
          console.log(
            `boundingPlane: minX: ${this.boundingPlane.minX} maxX: ${this.boundingPlane.maxX} minY: ${this.boundingPlane.minY} maxY: ${this.boundingPlane.maxY}`
          );
          this.containmentArea = this.getRandomRect(this.randomAngle);
          this.doOnce = false;
        }

        this.showAxes(scene);
        this.drawContainmentArea(scene);
        this.drawQueryPoints(scene);
      };
    };

    const canvas = new p5(sketch);
  }

  private addCircle(scene: p5) {
    const adjustedMousePos = this.getAdjustedMousePos(scene);
    const c = {
      x: adjustedMousePos.x,
      y: adjustedMousePos.y,
      height: 80,
      width: 80,
      isContained: false,
    };
    this.circles.push(c);
    c.isContained = this.isCircleContained(c, this.containmentArea);
  }

  private drawQueryPoints(scene: p5) {
    this.circles.forEach((c) => {
      const fillColor = c.isContained
        ? { r: 0, g: 255, b: 0 }
        : { r: 255, g: 0, b: 0 };
      scene.fill(fillColor.r, fillColor.g, fillColor.b, circleOpacity * 255);
      scene.ellipse(c.x, c.y, c.width, c.height);
      scene.line(c.x - c.width / 2, c.y, c.x + c.width / 2, c.y);
      scene.line(c.x, c.y - c.height / 2, c.x, c.y + c.height / 2);
    });
  }

  private drawContainmentArea(scene: p5) {
    scene.fill(255, 255, 255, 255);
    scene.push();
    this.containmentArea.vertices.forEach((v) => {
      scene.circle(v.x, v.y, 20);
    });
    // scene.rotate(this.randomAngle);
    // scene.rect(
    //   this.containmentArea.vertices[0].x,
    //   this.containmentArea.vertices[0].y,
    //   this.containmentArea.width,
    //   this.containmentArea.height
    // );
    // scene.fill('orange');
    // scene.circle(
    //   this.containmentArea.vertices[0].x,
    //   this.containmentArea.vertices[0].y,
    //   8
    // );
    // scene.stroke('orange');
    // scene.strokeWeight(3);
    // scene.line(
    //   this.containmentArea.vertices[0].x,
    //   this.containmentArea.vertices[0].y,
    //   this.containmentArea.vertices[0].x + this.containmentArea.width,
    //   this.containmentArea.vertices[0].y
    // );
    scene.pop();
  }

  private isCircleContained(circle: Circle, rect: Rectangle): boolean {
    const rotatedPoint = rotatePointAroundOrigin(
      { x: circle.x, y: circle.y },
      -this.randomAngle
    );
    return (
      rotatedPoint.x >= rect.vertices[0].x &&
      rotatedPoint.x <= rect.vertices[0].x + rect.width &&
      rotatedPoint.y >= rect.vertices[0].y &&
      rotatedPoint.y <= rect.vertices[0].y + rect.height
    );
  }

  private getAdjustedMousePos(scene: p5) {
    const mouseX = scene.mouseX;
    const mouseY = scene.mouseY;
    // return {
    //   x: mouseX - this.screenWidth / 2,
    //   y: this.screenHeight / 2 - mouseY,
    // };
    return {
      x: mouseX,
      y: mouseY,
    };
  }

  private showAxes(scene: p5) {
    scene.line(0, this.screenHeight / 2, 0, -this.screenHeight / 2);
    scene.line(-this.screenWidth / 2, 0, this.screenWidth / 2, 0);
  }

  private getRandomRect(rotation: radians): Rectangle {
    const fudgeFactor = 50;
    const randomWidth = getRandomFloat(100, 500);
    const randomHeight = getRandomFloat(100, 500);
    const randomX = getRandomFloat(
      -this.screenWidth / 2 + fudgeFactor,
      this.screenWidth / 2 - randomWidth - fudgeFactor
    );
    const randomY = getRandomFloat(
      -this.screenHeight / 2 + fudgeFactor,
      this.screenHeight / 2 - randomHeight - fudgeFactor
    );
    const rect = new Rectangle(randomX, randomY, randomWidth, randomHeight);
    rect.rotate(this.randomAngle);

    rect.vertices.forEach((v, vertIdx) => {
      let hasAlreadyBeenPrinted = false;
      if (v.x < this.boundingPlane.minX) {
        console.log(
          `vert${vertIdx}: (${v.x}, ${v.y}) out of bounds: minX: ${this.boundingPlane.minX}`
        );
        hasAlreadyBeenPrinted = true;
      }
      if (v.x > this.boundingPlane.maxX) {
        console.log(
          `vert${vertIdx}: (${v.x}, ${v.y}) out of bounds: maxX: ${this.boundingPlane.maxX}`
        );
        hasAlreadyBeenPrinted = true;
      }
      if (v.y < this.boundingPlane.minY) {
        console.log(
          `vert${vertIdx}: (${v.x}, ${v.y}) out of bounds: minY: ${this.boundingPlane.minY}`
        );
        hasAlreadyBeenPrinted = true;
      }
      if (v.y > this.boundingPlane.maxY) {
        console.log(
          `vert${vertIdx}: (${v.x}, ${v.y}) out of bounds: maxY: ${this.boundingPlane.maxY}`
        );
        hasAlreadyBeenPrinted = true;
      }
      if (!hasAlreadyBeenPrinted) {
        console.log(`vert${vertIdx}: (${v.x}, ${v.y})`);
      }
    });
    return rect;
  }
}
