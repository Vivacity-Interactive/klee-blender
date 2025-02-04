import { Canvas2D } from "../canvas";
import { Constants } from "../constants";
import { PropertySubCategory, PropertyType } from "../data/custom-property-enums";
import { Value } from "../data/value";
import { ControlLayout } from "./control";
import { UserControl } from "./user-control";
import { ValueType } from "./utils/user-utils";


export class ValueBoxControl extends UserControl {

    private value: Value;
    private title: string;
    private desc: ValueType;

    constructor(value: number, title: string = "", desc: ValueType = null, _uid: number | string = null) {
        super();
        this.desc = desc;
        this.title = title;
        this.value = new Value(value, desc.type);
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
        const bFactor = this.value.unit == PropertySubCategory.Factor;
    
        canvas.save();
        canvas
            .roundedRectangle(0, 0, this.size.x, this.size.y, Constants.DEFAULT_BOX_RADIUS)
            .fillStyle("#545454FF")
            .clip()
            .fill()

        if (bFactor) {
            canvas
                .fillStyle('#4772b3ff')
                .fillRect(0,0, this.size.x * this.value.ratio, this.size.y)
        }

        canvas
            .font(Constants.NODE_FONT)
            .fillStyle(fillStyle)
            .textAlign("right")
            .fillText(this.value.formatted, this.size.x - Constants.DEFAULT_VALUE_BOX_TEXT_PADDING*3, Constants.DEFAULT_VALUE_BOX_TEXT_PADDING + this.size.y/2)
        
        canvas.restore();
        canvas.roundedRectangle(0, 0, this.size.x*0.5, this.size.y, Constants.DEFAULT_BOX_RADIUS)
            .clip()
            .font(Constants.NODE_FONT)
            .fillStyle(fillStyle)
            .textAlign("left")
            .fillText(this.title, Constants.DEFAULT_VALUE_BOX_TITLE_PADDING, Constants.DEFAULT_VALUE_BOX_TEXT_PADDING + this.size.y/2);
    }
}
