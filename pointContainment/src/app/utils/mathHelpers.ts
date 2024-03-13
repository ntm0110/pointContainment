import { Point2D } from '../models/point';

export type radians = number;

export const degreesToRadians = (degrees: number) => {
  return degrees * (Math.PI / 180.0);
};

export const radiansToDegrees = (rad: number) => {
  return (rad * 180.0) / Math.PI;
};

export const rotatePointAroundOrigin = (
  point: Point2D,
  theta: radians
): Point2D => {
  return rotatePointAroundPoint(point, { x: 0, y: 0 }, theta);
};

export const rotatePointAroundPoint = (
  pointToRotate: Point2D,
  pointOfRotation: Point2D,
  theta: radians
): Point2D => {
  const vectorDifference = {
    x: pointToRotate.x - pointOfRotation.x,
    y: pointToRotate.y - pointOfRotation.y,
  };
  const rotatedX =
    vectorDifference.x * Math.cos(theta) - vectorDifference.y * Math.sin(theta);
  const rotatedY =
    vectorDifference.x * Math.sin(theta) + vectorDifference.y * Math.cos(theta);
  const rotatePoint = {
    x: pointOfRotation.x + rotatedX,
    y: pointOfRotation.y + rotatedY,
  };
  return rotatePoint;
};
