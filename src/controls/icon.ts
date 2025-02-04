import { Canvas2D } from "../canvas";
import { Constants } from "../constants";
import { IconCategory } from "../data/icon-category";
import { UserControl } from "./user-control";
import { LOT_ICONS } from "./utils/icon-library";
import { SVGIcon } from "./utils/icon-utils";

export class Icon extends UserControl {

    private _icon: SVGIcon;
    private _iconScale: number;

    constructor(iconId: IconCategory) {
        super();
        this.width = 22;
        this.height = 20;
        this.padding = { top: 3, right: 0, bottom: 0, left: 0 };

        this._iconScale = Math.floor(this.height * 0.85);
        const _color = '#cccccc';
        const data = LOT_ICONS[iconId];
        if (data) {
            this._icon = new SVGIcon(data, iconId+_color, _color);
        }
    }

    protected onDraw(canvas: Canvas2D) {
/// #if DEBUG_UI
        canvas.strokeStyle("#00e");
        canvas.strokeRect(0, 0, this.size.x + this.padding.left + this.padding.right, this.size.y + this.padding.top + this.padding.bottom);
/// #endif
        const _scale = this._iconScale;
        const _margin:number = (this.height - this._iconScale)/2
        const _this = this;

        const _f = (icon: SVGIcon) => {
            canvas.drawImage(icon, _margin, _margin + (_this.size.y - _scale)/2, _scale, icon.ratio * _scale);
        }

        this._icon.queue(_f, _f, canvas);
    }

}