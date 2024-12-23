import { Vector2 } from "../../math/vector2";
import { Node } from "./node";

export class ZoneNode extends Node {
    shape: Vector2[];
    children: Node[];
}
