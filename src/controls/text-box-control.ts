import { Canvas2D } from "../canvas";
import { Constants } from "../constants";
import { Vector2 } from "../math/vector2";
import { ControlLayout } from "./control";
import { UserControl } from "./user-control";


export class TextBoxControl extends UserControl {

    private text: string;

    constructor(text: string, placeHolder: string = "") {
        super();
        this.text = text;
        this.height = Constants.DEFAULT_BOX_HEIGHT;
        this.width = 96;
        this.ignoreLayout = true;
        this.controlLayout |= ControlLayout.FillParentHorizontal;
    }

    override initialize() {
    }

    protected onDraw(canvas: Canvas2D) {
/// #if DEBUG_UI
        canvas.strokeStyle("#0FF");
        canvas.strokeRect(0, 0, this.size.x + this.padding.left + this.padding.right, this.size.y + this.padding.top + this.padding.bottom);
/// #endif
        canvas
            .roundedRectangle(0, 0, this.size.x, this.size.y, Constants.DEFAULT_BOX_RADIUS)
            .fillStyle('#1D1D1DFF')
            .clip()
            .fill()
            .font(Constants.NODE_FONT)
            .fillStyle("#ccc")
            .textAlign("left")
            .fillText(this.text, Constants.DEFAULT_VALUE_BOX_TEXT_PADDING, Constants.DEFAULT_VALUE_BOX_TEXT_PADDING + this.size.y/2)
    }
}
