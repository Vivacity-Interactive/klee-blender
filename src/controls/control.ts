import { Vector2 } from "../math/vector2";

export abstract class Control {

    private _position: Vector2;
    public width?: number;
    public height?: number;
    protected minWidth?: number;
    protected minHeight?: number;
    public desiredWidth: number;
    public desiredHeight: number;
    protected zIndex: number;

    public fillParentHorizontal: boolean;
    public fillParentVertical: boolean;

    constructor(x?: number, y?: number, zIndex?: number) {
        this.position = new Vector2((x || 0), (y || 0));
        this.zIndex = zIndex || 0;
    }

    get position() {
        return this._position;
    }

    set position(value: Vector2) {
        this._position = value;
    }

    public get size(): Vector2 {
        return new Vector2(this.width, this.height);
    }

    get ZIndex(): number {
        return this.zIndex;
    }

    set ZIndex(value: number) {
        this.zIndex = value;
    }
}