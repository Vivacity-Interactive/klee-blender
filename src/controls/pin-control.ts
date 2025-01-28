import { Canvas2D } from "../canvas";
import { Constants } from "../constants";
import { PinDirection } from "../data/pin/pin-enums";
import { PinProperty } from "../data/pin/pin-property";
import { Vector2 } from "../math/vector2";
import { ControlLayout, VerticalAlignment } from "./control";
import { HorizontalPanel } from "./horizontal-panel";
import { Label } from "./label";
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
        this.controlLayout |= ControlLayout.FillParentHorizontal;
        this.hidden = this._pinProperty.isHidden;//false;

        this._isInput = this._pinProperty.direction !== PinDirection.Output;
        this._color = ColorUtils.getCustomColor(this.pinProperty.valueType) 
            ?? ColorUtils.getPinColor(this.pinProperty);
        
        this.width = 0;
        this.height = Constants.DEFAULT_PROPERTY_HEIGHT;

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
            const _panel = new HorizontalPanel();
            const _box = this.defaultValueBox = new _BoxClass(this.pinProperty.defaultValue, this._pinProperty.formattedName, this.pinProperty.id);
            const _paddingH = PinControl.PINS_PADDING_HORIZONTAL + PinControl.PINS_PADDING_LEFT_DEFAULT_BOX;
            const _paddingV = (Constants.DEFAULT_PROPERTY_HEIGHT - Constants.DEFAULT_BOX_HEIGHT)/2;
            _panel.padding.left = _panel.padding.right = _paddingH;
            _panel.padding.top = _panel.padding.bottom = _paddingV;
            _panel.height = Constants.DEFAULT_BOX_HEIGHT
            _panel.height = Math.max(_box.height, _panel.height);
            _panel.controlLayout |= ControlLayout.FillParentVertical;
            _panel.childAlignment = VerticalAlignment.Top

            _panel.add(_box);
            this.height = Math.max(this.height, _panel.height);
            this.children.push(_panel);
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
        canvas.translate(paddingX, Math.floor(Constants.DEFAULT_PROPERTY_HEIGHT/2));//this.height

        this.drawPin(canvas);

        canvas.restore();
    }

    drawPinIcon(canvas: Canvas2D, icon: SVGIcon) {
        const pinX = Math.floor(this.getPinX());
        const _scale = this._iconScale;

        const _this = this;
        const _f = (icon: SVGIcon) => {
            canvas.drawImage(icon, pinX - _scale * 0.5, -_scale * 0.5, _scale, icon.ratio * _scale);
        }

        this.icon.queueId(this.pinProperty.id, _f, canvas);
    }

    private drawPin(canvas: Canvas2D) {
        if (!this.defaultValueBox) {
            let textX = this.setupTextDrawing(canvas);
            canvas.fillText(this._pinProperty.formattedName, textX, 4);
        }
        
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

        canvas.font(Constants.NODE_FONT)
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
