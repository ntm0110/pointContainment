import { Point2D } from "../models/point";

export type radians = number;

export const degreesToRadians = (degrees: number) => {
  return degrees * (Math.PI / 180.0);
};

export const radiansToDegrees = (rad: number) => {
  return (rad * 180.0) / Math.PI;
};


export const rotatePointAroundOrigin = (point: Point2D, theta: radians): Point2D
{
    const rotatedX = (point.x * Math.cos(theta)) - (point.y * Math.sin(theta));
    const rotatedY = (point.y * Math.cos(theta)) + (point.x * Math.sin(theta));
    return {x: rotatedX, y: rotatedY}
}
