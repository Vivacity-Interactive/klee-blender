import { Canvas2D } from "../canvas";
import { Vector2 } from "../math/vector2";
import { Container } from "./container";
import { HorizontalAlignment } from "./control";

export class VerticalPanel extends Container {

    public childAlignment: HorizontalAlignment = HorizontalAlignment.Left;

    constructor(x?: number, y?: number, zIndex?: number) {
        super(x, y, zIndex);
    }

    protected onDraw(canvas: Canvas2D) { 
/// #if DEBUG_UI
            canvas.fillStyle("rgba(220,220,0,0.2)");
            canvas.fillRect(0, 0, this.size.x, this.size.y);
/// #endif
    }

    override getCalculatedSize(): Vector2 {
        let size = new Vector2(0, 0);
        let childHeight = 0;
        this.verticalFillCount = 0;

        for (let child of this.children) {
            if (child.ignoreLayout || !child.visible)
                continue;

            let childSize = child.getCalculatedSize();

            if (!child.ignoreHorizontalLayout) {
                size.x = Math.max(size.x, childSize.x);
            }

            if(!child.ignoreVerticalLayout) {
                child.position.y = size.y;
                size.y += childSize.y;

                if (child.fillParent && child.fillHorizontal) {
                    this.verticalFillCount++;
                } else {
                    childHeight += childSize.y;
                }
            }
        }

        size.x = Math.max(size.x, (this.minWidth || 0));
        size.y = Math.max(size.y, (this.minHeight || 0));

        size.x = (this.width || size.x);
        size.y = (this.height || size.y);

        this.controlSize = size.copy();
        this.childrenHeight = childHeight;

        size.x += this.padding.left + this.padding.right;
        size.y += this.padding.top + this.padding.bottom;

        return size;
    }

    private positionChildren() {
        if (this.childAlignment == HorizontalAlignment.Right) {
            for (let child of this.children) {
                child.position.x = (this.size.x - this.padding.left) - child.size.x;
            }
        } else if (this.childAlignment == HorizontalAlignment.Center) {
            for (let child of this.children) {
                child.position.x = this.padding.left + child.size.x/2;
            }
        }
    }


    override applyFills(remainingSize?: Vector2): void {
        let remainingHeight = (remainingSize?.y || this.size.y) - this.childrenHeight - (this.padding.top + this.padding.bottom);
        let width = this.size.x;
        let height = remainingHeight / this.verticalFillCount;

        let position = new Vector2(this.padding.left, this.padding.top);

        for (let child of this.children) {
            if (child.ignoreLayout || !child.visible)
                continue;

            if (!child.ignoreHorizontalLayout) {
                child.position.x = position.x;
                if (child.fillParent && child.fillHorizontal) {
                    child.desiredWidth = width;
                }
            }

            if(!child.ignoreVerticalLayout) {
                child.position.y = position.y;
                if (child.fillParent && child.fillVertical) {
                    child.desiredHeight = height;
                }
                position.y += child.size.y + (child.padding.top || 0) + (child.padding.bottom || 0);
            }

            if (child instanceof Container) {
                (child as Container).applyFills(new Vector2(width, height));
            }
        }

        this.positionChildren();
    }
}