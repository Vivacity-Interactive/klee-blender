import { Canvas2D } from "../canvas";
import { UserControl } from "./user-control";
import { Color } from "../data/color";
import { Constants } from "../constants";
import { ControlLayout } from "./control";


export class ColorBoxControl extends UserControl {

    private color: Color;
    private title: string;

    constructor(color: Color, title: string = "") {
        super();
        this.title = title;
        this.color = color;
        this.height = Constants.DEFAULT_BOX_HEIGHT;
        this.controlLayout |= ControlLayout.FillParentHorizontal | ControlLayout.IgnoreVertical;
    }

    protected onDraw(canvas: Canvas2D) {
/// #if DEBUG_UI
        canvas.strokeStyle("#0FF");
        canvas.strokeRect(0, 0, this.size.x + this.padding.left + this.padding.right, this.size.y + this.padding.top + this.padding.bottom);
/// #endif
        canvas.save();
        canvas
            .roundedRectangle(this.size.x*0.3 + Constants.DEFAULT_VALUE_BOX_MARGIN_LEFT, 0, this.size.x*0.7 - Constants.DEFAULT_VALUE_BOX_MARGIN_LEFT, Constants.DEFAULT_BOX_HEIGHT, Constants.DEFAULT_BOX_RADIUS)
            .fillStyle(this.color.toRGBAString())
            .fill()

        canvas.restore();
        canvas.roundedRectangle(0, 0, this.size.x, this.size.y, Constants.DEFAULT_BOX_RADIUS)
            .clip()
            .font(Constants.NODE_FONT)
            .fillStyle('#cccccc')
            .textAlign("left")
            .fillText(this.title, 0, Constants.DEFAULT_VALUE_BOX_TEXT_PADDING + this.size.y/2);
    }
}
