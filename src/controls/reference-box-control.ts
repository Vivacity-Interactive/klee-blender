import { Canvas2D } from "../canvas";
import { Constants } from "../constants";
import { PropertyType } from "../data/custom-property-enums";
import { IconCategory } from "../data/icon-category";
import { ControlLayout } from "./control";
import { UserControl } from "./user-control";
import { LOT_ICONS } from "./utils/icon-library";
import { LOT_DATA_ICON, SVGIcon } from "./utils/icon-utils";
import { ValueType } from "./utils/user-utils";


export class ReferenceBoxControl extends UserControl {

    private text: string;
    private title: string;
    private desc: ValueType;

    private _uid: number | string;
    private _icon: SVGIcon;
    private _icon2: SVGIcon;
    private _iconScale: number;
    private _icon2Scale: number;

    constructor(ref: any, title: string = "", desc: ValueType = null, _uid: number | string = null) {
        super();
        this._uid = _uid;
        this.desc = desc;
        this.title = title;
        this.text = ref ? ref.name_full ?? ref.name : "";
        this.height = Constants.DEFAULT_BOX_HEIGHT;
        this.controlLayout |= ControlLayout.FillParentHorizontal | ControlLayout.IgnoreVertical;

        // Fix this optional, needs argument variation on show,
        const iconId = LOT_DATA_ICON[desc.type];
        const data = LOT_ICONS[iconId];
        if (data) {
            this._icon = new SVGIcon(data, iconId+'#cccccc', '#cccccc');
            this._iconScale = Math.floor(this.height * 0.9);
        }

        // Fix this optional, needs custon icon or none.
        const bText = this.text && this.text.length;
        const iconId2 = bText ? IconCategory.X : (desc.type == PropertyType.OBJECT ? IconCategory.EYEDROPPER : null);
        const data2 = LOT_ICONS[iconId2];
        if (data2) {
            this._icon2 = new SVGIcon(data2, iconId2+'#cccccc', '#cccccc');
            this._icon2Scale = Math.floor(this.height * (bText ? 0.5 : 0.9)); //TODO: X
        }
    }

    override initialize() {
        
    }


    drawIcons(canvas: Canvas2D) {
        const _scale = this._iconScale;
        const _scale2 = this._icon2Scale;
        const _margin:number = (this.height - this._iconScale)/2
        const _this = this;
        
        if (this._icon)
        {
            const _f = (icon: SVGIcon) => {
                canvas.drawImage(icon, _margin*1.5, (_this.size.y - _scale)/2, _scale, icon.ratio * _scale);
            }
            this._icon.queue(this._uid, _f, canvas);
        }

        if (this._icon2) {
            const _f2 = (icon: SVGIcon) => {
                canvas.drawImage(icon, _this.size.x - _scale - _margin, (_this.size.y - _scale2)/2, _scale2, icon.ratio * _scale2);
            }
            this._icon2.queue(this._uid, _f2, canvas);
        }
    }

    protected onDraw(canvas: Canvas2D) {
/// #if DEBUG_UI
        canvas.strokeStyle("#0FF");
        canvas.strokeRect(0, 0, this.size.x + this.padding.left + this.padding.right, this.size.y + this.padding.top + this.padding.bottom);
/// #endif
        const bText = this.text && this.text.length;
        const textX = this._icon ? Constants.DEFAULT_VALUE_BOX_TITLE_PADDING : Constants.DEFAULT_VALUE_BOX_TEXT_PADDING;
        canvas
            .roundedRectangle(0, 0, this.size.x, this.size.y, Constants.DEFAULT_BOX_RADIUS)
            .fillStyle('#1d1d1d')
            .clip()
            .fill()
            .font(Constants.NODE_FONT)
            .fillStyle(bText ? '#cccccc' : '#6b6b6b')
            .textAlign("left")
            .fillText(bText ? this.text : this.title, textX, Constants.DEFAULT_VALUE_BOX_TEXT_PADDING + this.size.y/2);

            this.drawIcons(canvas);
    }
}
