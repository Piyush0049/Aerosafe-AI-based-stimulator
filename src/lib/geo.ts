import { Polygon, Vector3 } from "./types";

// 2D point-in-polygon (ray casting on X-Y plane)
export function isPointInPolygon(point: Vector3, polygon: Polygon): boolean {
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i].x, yi = polygon[i].y;
    const xj = polygon[j].x, yj = polygon[j].y;
    const intersect = yi > point.y !== yj > point.y && point.x < ((xj - xi) * (point.y - yi)) / (yj - yi + 0.0000001) + xi; // epsilon to avoid divide by zero
    if (intersect) inside = !inside;
  }
  return inside;
}

export function clampToWorld(x: number, min: number, max: number) {
  return Math.max(min, Math.min(max, x));
}


