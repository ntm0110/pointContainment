import {
  radians,
  rotatePointAroundOrigin,
  rotatePointAroundPoint,
} from '../utils/mathHelpers';
import { Point2D } from './point';

export class Rectangle {
  width: number;
  height: number;
  vertices: Point2D[];
  rotation: radians = 0;

  constructor(x: number, y: number, width: number, height: number) {
    this.vertices = [
      { x: x, y: y },
      { x: x + width, y: y },
      { x: x + width, y: y + height },
      { x: x, y: y + height },
    ];
    this.width = width;
    this.height = height;
  }

  rotate(rad: radians) {
    this.vertices[1] = rotatePointAroundPoint(
      this.vertices[1],
      this.vertices[0],
      rad
    );
    this.vertices[2] = rotatePointAroundPoint(
      this.vertices[2],
      this.vertices[0],
      rad
    );
    this.vertices[3] = rotatePointAroundPoint(
      this.vertices[3],
      this.vertices[0],
      rad
    );
    this.rotation = rad;
  }
}
