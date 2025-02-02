import { Canvas2D } from "../canvas";
import { Constants } from "../constants";
import { PropertyType } from "../data/custom-property-enums";
import { IconCategory } from "../data/icon-category";
import { ControlLayout } from "./control";
import { UserControl } from "./user-control";
import { LOT_ICONS } from "./utils/icon-library";
import { LOT_DATA_ICON, SVGIcon } from "./utils/icon-utils";


export class ReferenceBoxControl extends UserControl {

    private text: string;
    private title: string;

    private _uid: number | string;
    private _icon: SVGIcon;
    private _icon2: SVGIcon;
    private _iconScale: number;

    constructor(ref: any, title: string = "", _uid: number | string = null) {
        super();
        this.title = title;
        this.text = ref ? ref.name_full ?? ref.name : "";
        this.height = Constants.DEFAULT_BOX_HEIGHT;
        this.controlLayout |= ControlLayout.FillParentHorizontal | ControlLayout.IgnoreVertical;

        // Fix this optional, needs argument variation on show, 
        const data = LOT_ICONS[IconCategory.EYEDROPPER];
        if (data) {
            this._uid = _uid;
            this._icon = new SVGIcon(data, 'EYEDROPPER#cccccc', '#cccccc');
            this._iconScale = Math.floor(this.height * 0.9);
        }

        // Fix this optional, needs custon icon or none.
        const data2 = LOT_ICONS[IconCategory.OBJECT_DATA];
        if (data2) {
            this._icon2 = new SVGIcon(data2, 'OBJECT_DATA#cccccc', '#cccccc');
        }
    }

    override initialize() {
        
    }

    get icon(): SVGIcon { return this._icon; }

    get icon2(): SVGIcon { return this._icon2; }


    drawIcons(canvas: Canvas2D) {
        const _scale = this._iconScale;
        const _margin:number = (this.height - this._iconScale)/2
        
        const _this = this;
        const _f = (icon: SVGIcon) => {
            canvas.drawImage(icon, this.size.x - _scale - _margin, _margin*1.5, _scale, icon.ratio * _scale);
        }

        this.icon.queue(this._uid, _f, canvas);

        if (this.icon2) {
            const _f2 = (icon: SVGIcon) => {
                canvas.drawImage(icon, _margin*1.5, _margin*1.2, _scale, icon.ratio * _scale);
            }
            this.icon2.queue(this._uid, _f2, canvas);
        }
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
            .fillText(bText ? this.text : this.title, Constants.DEFAULT_VALUE_BOX_TITLE_PADDING, Constants.DEFAULT_VALUE_BOX_TEXT_PADDING + this.size.y/2);

            this.drawIcons(canvas);
    }
}
