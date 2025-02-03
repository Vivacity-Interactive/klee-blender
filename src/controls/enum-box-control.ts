import { Canvas2D } from "../canvas";
import { Constants } from "../constants";
import { IconCategory } from "../data/icon-category";
import { ControlLayout } from "./control";
import { UserControl } from "./user-control";
import { LOT_ICONS } from "./utils/icon-library";
import { SVGIcon } from "./utils/icon-utils";


export class EnumBoxControl extends UserControl {

    private text: string;
    //private title: string;

    private _uid: number | string;
    private _icon: SVGIcon;
    private _icon2: SVGIcon;
    private _iconScale: number;

    constructor(text: string, title: string = "", _uid: number | string = null) {
        super();
        this._uid = _uid;
        //this.title = title;
        this.text = text;
        this.height = Constants.DEFAULT_BOX_HEIGHT;
        this.controlLayout |= ControlLayout.FillParentHorizontal | ControlLayout.IgnoreVertical;
        this._iconScale = Math.floor(this.height * 0.5);

        const data = LOT_ICONS[IconCategory.DOWNARROW_HLT];
        if (data) {
            this._icon2 = new SVGIcon(data, 'DOWNARROW_HLT#cccccc', '#cccccc');
        }
    }

    override initialize() {
        
    }

    drawIcons(canvas: Canvas2D) {
        const _scale = this._iconScale;
        const _margin:number = (this.height - this._iconScale)/2
        const _this = this;
        
        const _f = (icon: SVGIcon) => {
            canvas.drawImage(icon, _this.size.x - _scale - _margin, (_this.size.y - icon.ratio * _scale)/2, _scale, icon.ratio * _scale);
        }

        this._icon2.queue(this._uid, _f, canvas);
    }

    protected onDraw(canvas: Canvas2D) {
/// #if DEBUG_UI
        canvas.strokeStyle("#0FF");
        canvas.strokeRect(0, 0, this.size.x + this.padding.left + this.padding.right, this.size.y + this.padding.top + this.padding.bottom);
/// #endif
        canvas
            .roundedRectangle(0, 0, this.size.x, this.size.y, Constants.DEFAULT_BOX_RADIUS)
            .fillStyle('#282828FF')
            .clip()
            .fill()
            .font(Constants.NODE_FONT)
            .fillStyle("#ccc")
            .textAlign("left")
            .fillText(this.text, Constants.DEFAULT_VALUE_BOX_TEXT_PADDING, Constants.DEFAULT_VALUE_BOX_TEXT_PADDING + this.size.y/2);

            this.drawIcons(canvas);
    }
}
