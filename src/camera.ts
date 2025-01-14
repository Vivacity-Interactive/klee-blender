import { Canvas2D } from "./canvas";
import { Vector2 } from "./math/vector2";

export class Camera {

    private _canvas: Canvas2D;
    private _position: Vector2;
    private _zoom: number;

    constructor(canvas: Canvas2D) {
        this._canvas = canvas;
        this._position = new Vector2(0, 0);
        this._zoom = 1.0;
    }

    public get position(): Vector2 {
        return this._position;
    }

    public get zoom(): number {
        return this._zoom;
    }

    prepareViewport() {
        const _frame = new Vector2(Math.round(this._canvas.width/2), Math.round(this._canvas.height/2));
        this._canvas.translate(_frame.x, _frame.y);
        this._canvas.getContext().scale(this._zoom, this._zoom);
        this._canvas.translate(Math.round(this._position.x-_frame.x), Math.round(this._position.y-_frame.y));
    }

    zoomRelative(value: number) {
        this._zoom -= value;
        this._zoom = Math.min(4.0, Math.max(this._zoom, 0.4));
    }

    moveRelative(value: Vector2) {
        this._position = this._position.add(value);
    }

    moveRelativeUseZoom(value: Vector2) {
        const scale = this._zoom ? 1/this._zoom : 0;
        this._position = this._position.add(value.multiply(scale));
    }

    centerAbsolutePosition(value: Vector2) {

        this._position = new Vector2(
            Math.round(value.x + this._canvas.width / 2),
            Math.round(value.y + this._canvas.height / 2));
    }

    zoomAbsolute(value: number=1.0) {
        this._zoom = value;
    }
}
