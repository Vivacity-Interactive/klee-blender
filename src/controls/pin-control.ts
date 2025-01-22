import { Canvas2D } from "../canvas";
import { PinDirection } from "../data/pin/pin-enums";
import { PinProperty } from "../data/pin/pin-property";
import { Vector2 } from "../math/vector2";
import { ControlLayout } from "./control";
import { HorizontalPanel } from "./horizontal-panel";
import { NodeConnectionControl } from "./node-connection-control";
import { NodeControl } from "./nodes/node-control";
import { UserControl } from "./user-control";
import { ColorUtils } from "./utils/color-utils";
import { _DDxIcon, IconUtils, SVGIcon } from "./utils/icon-utils";
import { LOT_USER_CONTROL } from "./utils/user-utils";


export class PinControl extends HorizontalPanel {

    private static readonly PIN_NAME_VALUED_PADDING_LEFT = 32 //14;
    private static readonly PIN_NAME_PADDING_LEFT = 12;
    private static readonly PIN_ICON_WIDTH = 10;
    private static readonly PINS_PADDING_HORIZONTAL = 0;
    private static readonly PINS_PADDING_LEFT_DEFAULT_BOX = 12;

    private _pinProperty: PinProperty;
    private defaultValueBox: UserControl;

    private _isInput: boolean;
    private _color: string;
    private hidden: boolean;

    private _icon: SVGIcon;
    private _iconScale: number;

    private connections: Array<NodeConnectionControl> = [];

    constructor(parentPosition: Vector2, pin: PinProperty) {
        super(0, 0);
        this._pinProperty = pin;
        this.controlLayout |= ControlLayout.FillParentHorizontal;;
        this.hidden = this._pinProperty.isHidden;//false;

        this._isInput = this._pinProperty.direction !== PinDirection.Output;
        this._color = ColorUtils.getCustomColor(this.pinProperty.valueType) 
            ?? ColorUtils.getPinColor(this.pinProperty);
        
        this.width = 0;
        this.height = 24;

        this.visible = !pin.isHidden;

        const data = IconUtils.getIconDataPinState(this._pinProperty);//LOT_ICONS[this._pinProperty.shape];
        if (data) { 
            this._icon = new SVGIcon(data, null, this._color);
            this._iconScale = Math.floor(this.height * 0.45);
        }
    }

    override initialize() {
        this.postInit();
    }
    
    get icon(): SVGIcon { return this._icon; }

    get iconScale(): number { return this._iconScale; }

    get pinProperty(): PinProperty {
        return this._pinProperty;
    }

    override set parent(value: UserControl) {
        this.controlParent = value;

        let nodeControl = this.findParent(NodeControl) as NodeControl;
        if (nodeControl) {
            // if (this.pinProperty.optionView == true && !nodeControl.showOptions && !this.pinProperty.isLinked) {
            //     this.visible = false;
            // }
        }
    }

    public addConnection(connection: NodeConnectionControl) {
        this.connections.push(connection);
    }

    public postInit(): void {
        const _BoxClass = this.pinProperty.isValued && LOT_USER_CONTROL[this.pinProperty.type];
        if (_BoxClass) {
            //console.log(this.pinProperty.name, this.pinProperty._raw);
            const _box = this.defaultValueBox = new _BoxClass(this.pinProperty.defaultValue);
            _box.position.x = PinControl.PINS_PADDING_HORIZONTAL + PinControl.PINS_PADDING_LEFT_DEFAULT_BOX;
            _box.position.y = Math.floor(this.height * 0.5) - _box.height/2;
            this.height = Math.max(_box.height, this.height);
            this.children.push(_box);
        }
    }

    public setHidden(hidden: boolean) {
        this.hidden = hidden;
    }

    public onDraw(canvas: Canvas2D): void {
        if (this.hidden)
            return;
        
/// #if DEBUG_UI
        canvas.strokeStyle("#e0e");
        canvas.strokeRect(0, 0, this.size.x + this.padding.left + this.padding.right, this.size.y + this.padding.top + this.padding.bottom);
/// #endif

        canvas.save();
        canvas.fillStyle(this._color).strokeStyle(this._color);

        let paddingX = (this.pinProperty.direction === PinDirection.Output) ? -this.padding.right : this.padding.left;
        canvas.translate(paddingX, Math.floor(this.height * 0.5));

        this.drawPin(canvas);

        canvas.restore();
    }

    drawPinIcon(canvas: Canvas2D, icon: SVGIcon) {
        const pinX = Math.floor(this.getPinX());
        const _scale = this._iconScale;

        const _this = this;
        const _f = (icon: SVGIcon) => {
            canvas
                .fillStyle(_this._color)
                .drawImage(icon, pinX - _scale * 0.5, -_scale * 0.5, _scale, icon.ratio * _scale);
        }

        this.icon.queueId(this.pinProperty.id, _f, canvas);
    }

    private drawPin(canvas: Canvas2D) {
        let textX = this.setupTextDrawing(canvas);

        canvas.fillText(this._pinProperty.formattedName, textX, 4);    
        
        if (this.icon) { this.drawPinIcon(canvas, this.icon); }
    }

    private getPinX() : number {
        return !this._isInput
            ?this.size.x - PinControl.PINS_PADDING_HORIZONTAL
            : PinControl.PINS_PADDING_HORIZONTAL;
    }

    private setupTextDrawing(canvas: Canvas2D) : number {
        const bVlued = this._pinProperty.isValued && this.defaultValueBox;
        const padding = bVlued ? PinControl.PIN_NAME_VALUED_PADDING_LEFT : PinControl.PIN_NAME_PADDING_LEFT;
        let textX = this.size.x - (PinControl.PINS_PADDING_LEFT_DEFAULT_BOX + PinControl.PINS_PADDING_HORIZONTAL);

        if (this._isInput) {
            canvas.textAlign("left")
            textX = padding + PinControl.PINS_PADDING_HORIZONTAL;
        } else {
            canvas.textAlign("right")
        } 

        canvas.font('400 11px sans-serif')
        .fillStyle("#eee");

        return textX;
    }

    // public formattedNameWidth(pin: PinProperty): number {
    //     return this.app.canvas.font(Constants.NODE_FONT).getContext().measureText(pin.formattedName).width + PinControl.PIN_NAME_PADDING_LEFT;
    // }

    public getPinAbsolutePosition(): Vector2 {
        let position = this.getAbsolutPosition();
        position.y += this.height * 0.5;

        if (this.pinProperty.direction === PinDirection.Output) {
            position.x += (this.width || this.size.x) - PinControl.PINS_PADDING_HORIZONTAL;
        } else {
            position.x += PinControl.PINS_PADDING_HORIZONTAL;
        }

        return position;
    }
}
