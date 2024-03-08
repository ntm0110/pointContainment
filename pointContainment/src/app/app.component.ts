import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import p5 from 'p5';
import { Circle } from './models/circle';
import { getRandomFloat } from './utils/random';
import { Rectangle } from './models/rectangle';

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
    this.containmentArea = this.getRandomRect();

    const sketch = (s: p5) => {
      s.setup = () => {
        s.createCanvas(this.screenWidth, this.screenHeight);
      };

      s.draw = () => {
        s.background('gray');
        s.fill(255, 255, 255, 255);
        s.rect(
          this.containmentArea.x,
          this.containmentArea.y,
          this.containmentArea.width,
          this.containmentArea.height
        );

        if (s.mouseIsPressed) {
          this.circles.push({
            x: s.mouseX,
            y: s.mouseY,
            height: 80,
            width: 80,
          });
        }

        this.circles.forEach((c) => {
          s.fill(255, 255, 255, 80);
          s.ellipse(c.x, c.y, c.width, c.height);
          s.line(c.x - c.width / 2, c.y, c.x + c.width / 2, c.y);
          s.line(c.x, c.y - c.height / 2, c.x, c.y + c.height / 2);
        });
      };
    };

    let canvas = new p5(sketch);
  }

  private isCircleContained() {}

  private getRandomRect(): Rectangle {
    const randomWidth = getRandomFloat(100, 1000);
    const randomHeight = getRandomFloat(100, 1000);
    const randomX = getRandomFloat(0, this.screenWidth - randomWidth);
    const randomY = getRandomFloat(0, this.screenHeight - randomHeight);
    console.log(
      `Containment Area: [${randomX}, ${randomY}, ${randomWidth}, ${randomHeight}]`
    );
    return { x: randomX, y: randomY, width: randomWidth, height: randomHeight };
  }
}
