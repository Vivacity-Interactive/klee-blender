import { Canvas2D } from "../canvas";
import { Constants } from "../constants";
import { IconCategory } from "../data/icon-category";
import { ControlLayout } from "./control";
import { UserControl } from "./user-control";
import { LOT_ICONS } from "./utils/icon-library";
import { SVGIcon } from "./utils/icon-utils";

export class CheckBoxControl extends UserControl {

    private isTrue: boolean;
    private title: string;
    
    private _uid: number | string;
    private _icon: SVGIcon;
    private _iconScale: number;

    constructor(isTrue: boolean, title: string = "", _uid: number | string = null) {
        super();
        this._uid = _uid;
        this.title = title;
        this.isTrue = isTrue;
        this.height = Constants.DEFAULT_BOX_HEIGHT;
        this.controlLayout |= ControlLayout.FillParentHorizontal | ControlLayout.IgnoreVertical;
        
        this._iconScale = Math.floor(this.height * 0.85);

        const data = this.isTrue && LOT_ICONS[IconCategory.CHECKMARK];
        if (data) {
            this._icon = new SVGIcon(data, 'CHECKMARK#cccccc', '#cccccc');
        }
    }

    drawIcons(canvas: Canvas2D) {
        if(this.isTrue) {
            const _scale = this._iconScale;
            const _margin:number = (this.height - this._iconScale)/2
            const _this = this;
            
            const _f = (icon: SVGIcon) => {
                canvas.drawImage(icon, _margin, _margin + (_this.size.y - _scale)/2, _scale, icon.ratio * _scale);
            }

            this._icon.queue(this._uid, _f, canvas);
        }
    }

    protected onDraw(canvas: Canvas2D) {
/// #if DEBUG_UI
        canvas.strokeStyle("#0FF");
        canvas.strokeRect(0, 0, this.size.x + this.padding.left + this.padding.right, this.size.y + this.padding.top + this.padding.bottom);
/// #endif
        canvas.save();
        canvas  // Draws background box
            .roundedRectangle(0, 0, Constants.DEFAULT_BOX_HEIGHT, Constants.DEFAULT_BOX_HEIGHT, Constants.DEFAULT_BOX_RADIUS)
            .fillStyle(this.isTrue ? '#4772b3ff' : '#545454ff')
            .fill()

        canvas  // Draws stroke
            .strokeStyle('#3d3d3dff')
            .lineWidth(1)
            .stroke();

        this.drawIcons(canvas);

        canvas.restore();
        canvas.roundedRectangle(0, 0, this.size.x, this.size.y, Constants.DEFAULT_BOX_RADIUS)
            .clip()
            .font(Constants.NODE_FONT)
            .fillStyle('#cccccc')
            .textAlign("left")
            .fillText(this.title, Constants.DEFAULT_VALUE_BOX_TITLE_PADDING, Constants.DEFAULT_VALUE_BOX_TEXT_PADDING + this.size.y/2);
    }
}
