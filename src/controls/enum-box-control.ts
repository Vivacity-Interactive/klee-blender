import { Canvas2D } from "../canvas";
import { Constants } from "../constants";
import { Enum } from "../data/Enum";
import { IconCategory } from "../data/icon-category";
import { ControlLayout } from "./control";
import { UserControl } from "./user-control";
import { LOT_ICONS } from "./utils/icon-library";
import { CustomDataType, LOT_DATA_ICON, SVGIcon } from "./utils/icon-utils";
import { ValueType } from "./utils/user-utils";


export class EnumBoxControl extends UserControl {

    private text: string;
    private desc: ValueType;
    //private title: string;

    private _uid: number | string;
    private _icon: SVGIcon;
    private _icon2: SVGIcon;
    private _iconScale: number;

    constructor(value: Enum, title: string = "", desc: ValueType = null, _uid: number | string = null) {
        super();
        this._uid = _uid;
        this.desc = desc;
        //this.title = title;
        this.text = value.title;
        this.height = Constants.DEFAULT_BOX_HEIGHT;
        this.controlLayout |= ControlLayout.FillParentHorizontal | ControlLayout.IgnoreVertical;
        
        this._iconScale = Math.floor(this.height * 0.9);
        
        const _color = '#cccccc'
        const _iconId = LOT_DATA_ICON[CustomDataType[value.value] ?? desc.type];
        const data = LOT_ICONS[_iconId];
        if (data) {
            this._icon = new SVGIcon(data, _iconId+_color, _color);
        }
        
        const _iconId2 = IconCategory.DOWNARROW_HLT;
        const data2 = LOT_ICONS[_iconId2];
        if (data2) {
            this._icon2 = new SVGIcon(data2, _iconId2+_color, _color);
        }
    }

    override initialize() {
        
    }

    drawIcons(canvas: Canvas2D) {
        const _scale = this._iconScale;
        const _scale2 = this._iconScale * 0.5;
        const _margin:number = (this.height - this._iconScale)/2
        const _this = this;

        if (this._icon) {
            const _f = (icon: SVGIcon) => {
                canvas.drawImage(icon, _margin*1.5, (_this.size.y - _scale)/2, _scale, icon.ratio * _scale);
            }
    
            this._icon.queue(this._uid, _f, canvas);
        }
        
        const _f2 = (icon: SVGIcon) => {
            canvas.drawImage(icon, _this.size.x - _scale2 - _margin*2, (_this.size.y - icon.ratio * _scale2)/2, _scale2, icon.ratio * _scale2);
        }

        this._icon2.queue(this._uid, _f2, canvas);
    }

    protected onDraw(canvas: Canvas2D) {
/// #if DEBUG_UI
        canvas.strokeStyle("#0FF");
        canvas.strokeRect(0, 0, this.size.x + this.padding.left + this.padding.right, this.size.y + this.padding.top + this.padding.bottom);
/// #endif
        const textX = this._icon ? Constants.DEFAULT_VALUE_BOX_TITLE_PADDING : Constants.DEFAULT_VALUE_BOX_TEXT_PADDING;
        canvas
            .roundedRectangle(0, 0, this.size.x, this.size.y, Constants.DEFAULT_BOX_RADIUS)
            .fillStyle('#282828FF')
            .clip()
            .fill()
            .font(Constants.NODE_FONT)
            .fillStyle("#ccc")
            .textAlign("left")
            .fillText(this.text, textX, Constants.DEFAULT_VALUE_BOX_TEXT_PADDING + this.size.y/2);

            this.drawIcons(canvas);
    }
}
