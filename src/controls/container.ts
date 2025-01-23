
import { Canvas2D } from "../canvas";
import { Vector2 } from "../math/vector2";
import { ControlLayout } from "./control";
import { UserControl } from "./user-control";

export abstract class Container extends UserControl {

    protected children: Array<UserControl>;
    protected drawChildren: boolean = true;
    protected horizontalFillCount: number;
    protected verticalFillCount: number;
    protected childrenWidth: number;
    protected childrenHeight: number;

    constructor(x?: number, y?: number, zIndex?: number) {
        super(x, y, zIndex);
        this.controlLayout |= ControlLayout.FillParentHorizontal;

        this.children = [];
    }

    get fillChildSafe(): boolean {
        return this.fillChild && !this.children.reduce((a, b) => a || !b.fillChild, true)
    }

    _fillChildSafe(child: UserControl): boolean {
        return this.fillChild && !child.fillParent
    }

    override refreshLayout() {
        super.refreshLayout();

        this.applyFills();
    }

    override draw(canvas: Canvas2D): void {
        if (!this.visible) {
            return;
        }

        canvas.save();
        canvas.translate(Math.round(this.position.x), Math.round(this.position.y));

        this.onDraw(canvas);

        if (this.drawChildren) {
            canvas.save();
            canvas.translate(Math.round(this.padding.left), Math.round(this.padding.top));
            for (let child of this.children) {
                child.draw(canvas);
            }
            canvas.restore();
        }
        canvas.restore();
    }

    protected abstract onDraw(canvas: Canvas2D);

    public add(child: UserControl): UserControl {
        this.children.push(child);
        child.parent = this;

        return child;
    }

    public insert(child: UserControl, index: number): UserControl {
        this.children.splice(index, 0, child);
        child.parent = this;
        
        return child;
    }

    public getChildren() : Array<UserControl> {
        return this.children;
    }

    override getCalculatedSize(): Vector2
    {
        let size = new Vector2(0, 0);

        for (let child of this.children) {
            if (child.ignoreLayout)
                continue;
            
            let childSize = child.getCalculatedSize();

            if (!child.ignoreHorizontalLayout) {
                size.x = Math.max(size.x, childSize.x);
            }

            if(!child.ignoreVerticalLayout) {
                size.y = Math.max(size.y, childSize.y);
            }
        }


        size.x += this.padding.left + this.padding.right;
        size.y += this.padding.top + this.padding.bottom;

        size.x = Math.max(size.x, (this.minWidth || 0));
        size.y = Math.max(size.y, (this.minHeight || 0));

        this.controlSize = size.copy();

        for (let child of this.children) {
            if (child.fillParent && child.fillHorizontal) {
                child.desiredWidth = this.size.x - this.padding.left - this.padding.right;
            }
            
            if (child.fillParent && child.fillVertical) {
                child.desiredHeight = this.size.y - this.padding.top - this.padding.top;
            }
        }

        return size;
    }

    public override isDirty(): boolean {
        let dirty = this.dirty;
        for (let child of this.children) {
            dirty = dirty || child.isDirty();
        }

        return dirty;
    }

    public applyFills(remainingSize?: Vector2): void {
        for (let child of this.children) {
            if (child instanceof Container) {
                child.applyFills();
            }
        }
    }
}