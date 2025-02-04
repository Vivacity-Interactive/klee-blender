import { Canvas2D } from "../canvas";
import { Constants } from "../constants";
import { ControlLayout } from "./control";
import { UserControl } from "./user-control";
import { ValueType } from "./utils/user-utils";


export class TextBoxControl extends UserControl {

    private text: string;
    private title: string;
    //private desc: ValueType;

    constructor(text: string, title: string = "", desc: ValueType = null, _uid: number | string = null) {
        super();
        //this.desc = desc;
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
    const bText = this.text && this.text.length;
    canvas
        .roundedRectangle(0, 0, this.size.x, this.size.y, Constants.DEFAULT_BOX_RADIUS)
        .fillStyle('#1d1d1d')
        .clip()
        .fill()
        .font(Constants.NODE_FONT)
        .fillStyle(bText ? '#cccccc' : '#6b6b6b')
        .textAlign("left")
        .fillText(bText ? this.text : this.title , Constants.DEFAULT_VALUE_BOX_TEXT_PADDING, Constants.DEFAULT_VALUE_BOX_TEXT_PADDING + this.size.y/2);
    }
}
