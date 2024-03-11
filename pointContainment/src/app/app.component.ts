import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import p5 from 'p5';
import { Circle } from './models/circle';
import { getRandomFloat } from './utils/random';
import { Rectangle } from './models/rectangle';

const circleOpacity = 0.05;

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  circles: Circle[] = [];
  containmentArea: Rectangle = {
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  };

  screenWidth = window.innerWidth;
  screenHeight = window.innerHeight;

  ngOnInit() {
    const sketch = (scene: p5) => {
      scene.setup = () => {
        scene.createCanvas(this.screenWidth, this.screenHeight);
        this.containmentArea = this.getRandomRect();
        scene.background('#8CC4A8');
      };

      scene.mousePressed = () => {
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
      };

      scene.draw = () => {
        // center origin
        scene.translate(this.screenWidth / 2, this.screenHeight / 2);
        // flip y so up is positive
        scene.scale(1, -1);

        this.showAxes(scene);

        scene.fill(255, 255, 255, 255);
        scene.rect(
          this.containmentArea.x,
          this.containmentArea.y,
          this.containmentArea.width,
          this.containmentArea.height
        );

        this.circles.forEach((c) => {
          const fillColor = c.isContained
            ? { r: 0, g: 255, b: 0 }
            : { r: 255, g: 0, b: 0 };
          scene.fill(
            fillColor.r,
            fillColor.g,
            fillColor.b,
            circleOpacity * 255
          );
          scene.ellipse(c.x, c.y, c.width, c.height);
          scene.line(c.x - c.width / 2, c.y, c.x + c.width / 2, c.y);
          scene.line(c.x, c.y - c.height / 2, c.x, c.y + c.height / 2);
        });
      };
    };

    let canvas = new p5(sketch);
  }

  private isCircleContained(circle: Circle, rect: Rectangle): boolean {
    return (
      circle.x >= rect.x &&
      circle.x <= rect.x + rect.width &&
      circle.y >= rect.y &&
      circle.y <= rect.y + rect.height
    );
  }

  private getAdjustedMousePos(scene: p5) {
    const mouseX = scene.mouseX;
    const mouseY = scene.mouseY;
    return {
      x: mouseX - this.screenWidth / 2,
      y: this.screenHeight / 2 - mouseY,
    };
  }

  private showAxes(scene: p5) {
    scene.line(0, this.screenHeight / 2, 0, -this.screenHeight / 2);
    scene.line(-this.screenWidth / 2, 0, this.screenWidth / 2, 0);
  }

  private getRandomRect(): Rectangle {
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
    return { x: randomX, y: randomY, width: randomWidth, height: randomHeight };
  }
}
