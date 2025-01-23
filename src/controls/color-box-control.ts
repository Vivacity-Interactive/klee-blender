import { Canvas2D } from "../canvas";
import { UserControl } from "./user-control";
import { Color } from "../data/color";
import { Constants } from "../constants";
import { ControlLayout } from "./control";


export class ColorBoxControl extends UserControl {

    private color: Color;

    constructor(color: Color) {
        super();

        this.color = color;
        this.width = Constants.DEFAULT_BOX_HEIGHT;
        this.height = Constants.DEFAULT_BOX_HEIGHT;
        this.controlLayout |= ControlLayout.Ignore;
    }

    protected onDraw(canvas: Canvas2D) {
/// #if DEBUG_UI
        canvas.strokeStyle("#0FF");
        canvas.strokeRect(0, 0, this.size.x + this.padding.left + this.padding.right, this.size.y + this.padding.top + this.padding.bottom);
/// #endif
        canvas
            .roundedRectangle(0, 0, this.size.x, this.size.y, Constants.DEFAULT_BOX_RADIUS)
            .fillStyle(this.color.toRGBAString())
            .fill()
    }
}
