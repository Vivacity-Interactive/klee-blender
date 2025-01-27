import { Canvas2D } from "../canvas";
import { Constants } from "../constants";
import { ControlLayout } from "./control";
import { UserControl } from "./user-control";


export class ValueBoxControl extends UserControl {

    private text: string;
    private title: string;

    constructor(text: string, title: string = "") {
        super();
        this.title = title;
        this.text = text;
        this.height = Constants.DEFAULT_BOX_HEIGHT;
        this.controlLayout |= ControlLayout.FillParentHorizontal | ControlLayout.IgnoreVertical;
    }

    override initialize() {
    }

    protected onDraw(canvas: Canvas2D) {
/// #if DEBUG_UI
        canvas.strokeStyle("#0FF");
        canvas.strokeRect(0, 0, this.size.x + this.padding.left + this.padding.right, this.size.y + this.padding.top + this.padding.bottom);
/// #endif
        const fillStyle = "#cccccc";
        
        canvas.save();
        canvas
            .roundedRectangle(0, 0, this.size.x, this.size.y, Constants.DEFAULT_BOX_RADIUS)
            .fillStyle("#545454FF")
            .clip()
            .fill()
            .font(Constants.NODE_FONT)
            .fillStyle(fillStyle)
            .textAlign("right")
            .fillText(this.text, this.size.x - Constants.DEFAULT_VALUE_BOX_MARGIN_LEFT, Constants.DEFAULT_VALUE_BOX_TEXT_PADDING + this.size.y/2)
        
        canvas.restore();
        canvas.roundedRectangle(0, 0, this.size.x*0.5, this.size.y, Constants.DEFAULT_BOX_RADIUS)
            .clip()
            .font(Constants.NODE_FONT)
            .fillStyle(fillStyle)
            .textAlign("left")
            .fillText(this.title, Constants.DEFAULT_VALUE_BOX_TITLE_PADDING, Constants.DEFAULT_VALUE_BOX_TEXT_PADDING + this.size.y/2);
    }
}
