import { Canvas2D } from "../canvas";
import { Constants } from "../constants";
import { IconCategory } from "../data/icon-category";
import { ControlLayout } from "./control";
import { UserControl } from "./user-control";
import { LOT_ICONS } from "./utils/icon-library";
import { LOT_DATA_ICON, SVGIcon } from "./utils/icon-utils";
import { ValueType } from "./utils/user-utils";


export class AssetBoxControl extends UserControl {

    private text: string;
    private title: string;
    private users: number;
    private desc: ValueType;

    private _uid: number | string;
    private _icon: SVGIcon;
    private _icon2: SVGIcon;
    private _icons: Array<{icon: SVGIcon, scale: number, active?: boolean, title?: string}> = [];
    private _iconScale: number;

    constructor(ref: any, title: string = "", desc: ValueType = null, _uid: number | string = null) {
        super();
        this._uid = _uid;
        this.desc = desc;
        this.title = title;
        this.text = ref ? ref.name_full ?? ref.name : "";
        this.users = ref.users - (+!!ref.use_fake_user);
        this.height = Constants.DEFAULT_BOX_HEIGHT;
        this.controlLayout |= ControlLayout.FillParentHorizontal | ControlLayout.IgnoreVertical;
        
        this._iconScale = Math.floor(this.height * 0.9);
        this.loadIcons(ref);
    }

    loadIcons(ref: any) {
        const _color = '#cccccc';
        const bText = this.text && this.text.length;
        let data = null;
        let iconId = null;

        iconId = LOT_DATA_ICON[this.desc.type];
        data = LOT_ICONS[iconId];
        if (data) {
            this._icon = new SVGIcon(data, iconId+_color, _color);
        }

        iconId = IconCategory.DOWNARROW_HLT;
        data = LOT_ICONS[iconId];
        if (data) {
            this._icon2 = new SVGIcon(data, iconId+_color, _color);
        }

        if (bText) {
            const bFakeUser = ref.use_fake_user;
            
            iconId = IconCategory.X;
            data = LOT_ICONS[iconId];
            if (data) {
                this._icons.push({ icon: new SVGIcon(data, iconId+_color,_color), scale: 0.6, active: false });
            }
            
            iconId = IconCategory.FILEBROWSER;
            data = LOT_ICONS[iconId];
            if (data) {
                this._icons.push({ icon: new SVGIcon(data, iconId+_color,_color), scale: 0.9, active: false });
            }
            
            iconId = IconCategory.DUPLICATE;
            data = LOT_ICONS[iconId];
            if (data) {
                this._icons.push({ icon: new SVGIcon(data, iconId+_color,_color), scale: 0.9, active: false });
            }
            
            iconId = bFakeUser ? IconCategory.FAKE_USER_ON : IconCategory.FAKE_USER_OFF;
            data = LOT_ICONS[iconId];
            if (data) {
                this._icons.push({ icon: new SVGIcon(data, iconId+_color,_color), scale: 0.9, active: bFakeUser });
            }
        } else {
            iconId = IconCategory.ADD;
            data = LOT_ICONS[iconId];
            if (data) {
                this._icons.push({ icon: new SVGIcon(data, iconId+_color,_color), scale: 0.6, title: "New" });
            }
            
            iconId = IconCategory.FILEBROWSER;
            data = LOT_ICONS[iconId];
            if (data) {
                this._icons.push({ icon: new SVGIcon(data, iconId+_color,_color), scale: 0.9, title: "Open" });
            }
        }
    }

    override initialize() {
        
    }

    drawAssetSelect(canvas: Canvas2D) {
        const _scale = this._iconScale;
        const _margin:number = (this.height - this._iconScale)/2
        const _this = this;
        const _paddingX = (this._icon ? _margin + _scale : Constants.DEFAULT_VALUE_BOX_TEXT_PADDING);

        canvas
            .fillStyle('#282828FF')
            .fillRect(0, 0, _margin * 2 + _paddingX + _scale * .5, this.size.y);

        if (this._icon)
        {
            
            
            const _f = (icon: SVGIcon) => {
                canvas.drawImage(icon, _margin, (_this.size.y - icon.ratio * _scale)/2, _scale, icon.ratio * _scale);
            }
    
            this._icon.queue(this._uid, _f, canvas);
        }

        const scale = _scale * 0.5;
        const scalex = _scale;
        const offsetx = (scalex - _scale)/2;

        const _f2 = (icon: SVGIcon) => {
            canvas.drawImage(icon, _margin + _paddingX + offsetx, (_this.size.y - icon.ratio * scale)/2, scale, icon.ratio * scale);
        }

        this._icon2.queue(this._uid+"A", _f2, canvas);
    }

    drawAssetContext(canvas: Canvas2D) {
        const _scale = this._iconScale;
        const _scalex = _scale * 1.2;
        const _margin:number = (this.height - this._iconScale)/2
        const _this = this;

        let index = 1;
        for (const _entry of this._icons) {
            const __scale = _scale * _entry.scale;
            const __offsetx = (_scalex - __scale)/2;
            
            canvas
                .fillStyle(_entry.active ? '#4772b3ff' : '#545454ff')
                .fillRect(_this.size.x - (_scalex - _margin)*index, 0, _scalex, this.size.y);
            
            const _index = index;
            const _h = (icon: SVGIcon) => {
                canvas.drawImage(icon, _this.size.x - (_scalex - _margin)*_index + __offsetx, (_this.size.y - icon.ratio * __scale)/2, __scale, icon.ratio * __scale);
            }

            _entry.icon.queue(this._uid+String(index), _h, canvas);
            index++;
        }

        if (this.users > 1) {
            const _textX = _scalex/2;
            const _offsetx = (_scalex - _scalex)/2;
            canvas
                .fillStyle('#545454ff')
                .fillRect(_this.size.x - (_scalex - _margin)*index, 0, _scalex, this.size.y)
                .fillStyle('#cccccc')
                .textAlign("center")
                .fillText(String(this.users), _this.size.x - (_scalex - _margin)*index + _offsetx + _textX, Constants.DEFAULT_VALUE_BOX_TEXT_PADDING + this.size.y/2);
        }
    }

    drawNoAssetContext(canvas: Canvas2D)
    {
        const _margin:number = (this.height - this._iconScale)/2
        const _scale = this._iconScale;
        const _offsetx = _margin * 3 + _scale * 1.5;
        const _scalex = (this.size.x - _offsetx)/this._icons.length;
        const _this = this;

        let index = 0;
        for (const _entry of this._icons) {
            const __scale = _scale * _entry.scale;
            const __offsetx = (_scale * 1.2 - __scale)/2;
            const _textX = _scalex/2;
            
            canvas
                .fillStyle('#545454ff')
                .fillRect(_offsetx + _scalex * index, 0, _scalex, this.size.y)
                .clip()
                .fillStyle('#cccccc')
                .textAlign("center")
                .fillText(_entry.title ?? "", _offsetx + _scalex * index + _textX, Constants.DEFAULT_VALUE_BOX_TEXT_PADDING + this.size.y/2);
            
            const _index = index;
            const _h = (icon: SVGIcon) => {
                canvas.drawImage(icon, _offsetx + _scalex * _index + _margin + __offsetx, (_this.size.y - icon.ratio * __scale)/2, __scale, icon.ratio * __scale);
            }
            index++;
            _entry.icon.queue(this._uid+String(index), _h, canvas);
        }
    }

    protected onDraw(canvas: Canvas2D) {
/// #if DEBUG_UI
        canvas.strokeStyle("#0FF");
        canvas.strokeRect(0, 0, this.size.x + this.padding.left + this.padding.right, this.size.y + this.padding.top + this.padding.bottom);
/// #endif
        const bText = this.text && this.text.length;
        const textX = this._icon ? Constants.DEFAULT_ASSET_BOX_TITLE_PADDING : (Constants.DEFAULT_VALUE_BOX_TEXT_PADDING + this._iconScale);
        canvas
            .roundedRectangle(0, 0, this.size.x, this.size.y, Constants.DEFAULT_BOX_RADIUS)
            .fillStyle('#1d1d1d')
            .clip()
            .fill()

            if (bText) { 
                canvas
                    .font(Constants.NODE_FONT)
                    .fillStyle('#cccccc')
                    .textAlign("left")
                    .fillText(bText ? this.text : this.title, textX, Constants.DEFAULT_VALUE_BOX_TEXT_PADDING + this.size.y/2);
                
                this.drawAssetContext(canvas);
            }
            else { this.drawNoAssetContext(canvas); }
            
            this.drawAssetSelect(canvas);
    }
}
