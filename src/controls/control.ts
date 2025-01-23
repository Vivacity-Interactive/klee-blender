import { Application } from "../application";
import { Vector2 } from "../math/vector2";

export enum ControlLayout {
    Fixed = 0,
    IgnoreHorizontal = 1 << 1,
    IgnoreVertical = 1 << 2,
    FillParent = 1 << 3,
    FillChild = 1 << 4,
    FillHorizontal = 1 << 5,
    FillVertical = 1 << 6,

    Ignore = IgnoreHorizontal | IgnoreVertical,
    FillParentHorizontal = FillParent | FillHorizontal,
    FillParentVertical = FillParent | FillVertical,
    FillChildHorizontal = FillChild | FillHorizontal,
    FillChildVertical = FillChild | FillVertical,
}

export abstract class Control {

    public controlLayout: ControlLayout;
    private _position: Vector2;
    public width?: number;
    public height?: number;
    public minWidth?: number;
    public minHeight?: number;
    public desiredWidth: number;
    public desiredHeight: number;
    protected zIndex: number;

    protected app: Application;

    constructor(x?: number, y?: number, zIndex?: number) {
        this.position = new Vector2((x || 0), (y || 0));
        this.zIndex = zIndex || 0;
    }

    get fillChild(): boolean {
        return (this.controlLayout & ControlLayout.FillChild) == ControlLayout.FillChild;
    }

    get fillParent(): boolean {
        return (this.controlLayout & ControlLayout.FillParent) == ControlLayout.FillParent;
    }

    get fillHorizontal(): boolean {
        return (this.controlLayout & ControlLayout.FillHorizontal) == ControlLayout.FillHorizontal;
    }

    get fillVertical(): boolean {
        return (this.controlLayout & ControlLayout.FillVertical) == ControlLayout.FillVertical;
    }

    get ignoreHorizontalLayout(): boolean {
        return (this.controlLayout & ControlLayout.IgnoreHorizontal) == ControlLayout.IgnoreHorizontal;
    }

    get ignoreVerticalLayout(): boolean {
        return (this.controlLayout & ControlLayout.IgnoreVertical) == ControlLayout.IgnoreVertical;
    }

    get ignoreLayout(): boolean {
        return (this.controlLayout & ControlLayout.Ignore) == ControlLayout.Ignore;
    }

    get fillChildSafe(): boolean {
        return true;
    }

    get fillParentSafe(): boolean {
        return true;
    }

    get position() {
        return this._position;
    }

    set position(value: Vector2) {
        this._position = value;
    }

    public initControl(app: Application) {
        this.app = app;
        this.initialize();
    }

    protected initialize() {

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