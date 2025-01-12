import { Canvas2D } from "../canvas";
import { Constants } from "../constants";
import { PinCategory, PinType } from "../data/pin/pin-category";
import { PinDirection } from "../data/pin/pin-direction";
import { PinProperty } from "../data/pin/pin-property";
import { PinShape } from "../data/pin/pin-shape";
import { Vector2 } from "../math/vector2";
import { NodeConnectionControl } from "./node-connection-control";
import { NodeControl } from "./nodes/node-control";
import { UserControl } from "./user-control";
import { ColorUtils } from "./utils/color-utils";
import { IconData, LOT_ICONS } from "./utils/icon-library";
import { SVGIcon } from "./utils/icon-utils";


export class PinControl extends UserControl {

    private static readonly PIN_NAME_PADDING_LEFT = 14;
    private static readonly PIN_ICON_WIDTH = 10;
    private static readonly PINS_PADDING_HORIZONTAL = 0;
    private static readonly PINS_PADDING_LEFT_DEFAULT_BOX = 8;

    private _pinProperty: PinProperty;
    private defaultValueBox: UserControl;

    private category: PinCategory;

    private _isInput: boolean;
    private _color: string;
    private _secondaryColor: string;
    private hidden: boolean;

    private icon?: HTMLImageElement;
    private iconRatio: number;
    private bIcon: boolean;
    private bDrawReady: boolean;
    
    private secondaryIcon?: Path2D;

    private connections: Array<NodeConnectionControl> = [];

    constructor(parentPosition: Vector2, pin: PinProperty) {
        super(0, 0);
        this._pinProperty = pin;
        this.hidden = false;
        this.bIcon = true;

        this._isInput = this._pinProperty.direction !== PinDirection.Output;
        this._color = ColorUtils.getPinColor(this.pinProperty);
        //if (this._pinProperty.valueType)
            //this._secondaryColor = ColorUtils.getPinColorByCategory(this._pinProperty.valueType as PinCategory);
        
        this.width = 0;
        this.height = 27;

        this.visible = !pin.hidden;
        this.category = pin.category;
    }

    override initialize() {
        if (this.visible) {
            if (!this.pinProperty.hidden && !this.pinProperty.hideName) {
                this.width = this.formattedNameWidth(this.pinProperty) + PinControl.PINS_PADDING_HORIZONTAL + PinControl.PIN_ICON_WIDTH;
            } else if (!this.pinProperty.hidden) {
                this.width = PinControl.PINS_PADDING_HORIZONTAL + PinControl.PIN_ICON_WIDTH;
            }
        }

        this.postInit();
    }
    
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
        if (this.pinProperty.shouldDrawDefaultValueBox && this._pinProperty.defaultValueControlClass) {
            this.defaultValueBox = new this._pinProperty.defaultValueControlClass(this._pinProperty.defaultValue);
            this.defaultValueBox.initControl(this.app);
            this.defaultValueBox.position.x = this.formattedNameWidth(this._pinProperty) + PinControl.PINS_PADDING_HORIZONTAL + PinControl.PINS_PADDING_LEFT_DEFAULT_BOX;
            this.defaultValueBox.padding.right = PinControl.PINS_PADDING_LEFT_DEFAULT_BOX;
            this.defaultValueBox.padding.left = PinControl.PINS_PADDING_LEFT_DEFAULT_BOX;
            this.width += this.defaultValueBox.width + this.defaultValueBox.padding.left + this.defaultValueBox.padding.right;
            this.height += this.defaultValueBox.padding.top + this.defaultValueBox.padding.bottom;
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
        let pinCategory = this.pinProperty.category;
        canvas.fillStyle(this._color).strokeStyle(this._color);

        let paddingX = (this.pinProperty.direction === PinDirection.Output) ? -this.padding.right : this.padding.left;
        canvas.translate(paddingX, Math.floor(this.height * 0.5));

        switch (pinCategory) {
            default:
                this.drawPin(canvas);
        }

        canvas.restore();
    }

    drawPinIcon(canvas: Canvas2D, icon: HTMLImageElement) {
        const pinX = Math.floor(this.getPinX());
        const _scale = Math.floor(this.height * 0.45);
        canvas
            .fillStyle(this._color)
            .drawImage(icon, pinX - _scale * 0.5, -_scale * 0.5, _scale, this.iconRatio * _scale);

        // if (this.secondaryIcon !== undefined) {
        //     canvas.fillStyle(this._secondaryColor)
        //     .fill(this.secondaryIcon, 'evenodd');
        // }
    }

    private drawPin(canvas: Canvas2D) {
        let textX = this.setupTextDrawing(canvas);
        const pinX = this.getPinX();

        canvas.fillText(this._pinProperty.formattedName, textX, 4);    
        
        const bLoadIcon = this.bIcon && !this.icon;
        if (bLoadIcon) {
            const data = LOT_ICONS[this._pinProperty.shape];
            this.bIcon = !!data;
            const _this = this;
            const _transform = canvas.getContext().getTransform();
            this.icon ??= new SVGIcon(data,(icon, ratio) => {
                canvas.save();
                _this.icon = icon; _this.iconRatio = ratio;
                canvas.getContext().setTransform(_transform)
                const _camera = canvas['__CAMERA__']
                canvas.translate(_camera.position.x, _camera.position.y);
                _this.drawPinIcon(canvas, icon)
                canvas.restore();
                
            }, this._color);
        }
        if (this.icon) { this.drawPinIcon(canvas, this.icon); }
    }

    private drawDefaultValueBox(canvas: Canvas2D) {
        if(this.defaultValueBox) {
            this.defaultValueBox.draw(canvas);
        }
    }

    private getPinX() : number {
        if (!this._isInput) {
            return this.size.x - PinControl.PINS_PADDING_HORIZONTAL;
        }
        return PinControl.PINS_PADDING_HORIZONTAL;
    }

    private setupTextDrawing(canvas: Canvas2D) : number {
        let textX = this.size.x - (PinControl.PIN_NAME_PADDING_LEFT + PinControl.PINS_PADDING_HORIZONTAL);

        if (this._isInput) {
            canvas.textAlign("left")
            textX = PinControl.PIN_NAME_PADDING_LEFT + PinControl.PINS_PADDING_HORIZONTAL;
        }
        else
            canvas.textAlign("right")

        canvas.font('400 11px sans-serif')
        .fillStyle("#eee");

        return textX;
    }

    public formattedNameWidth(pin: PinProperty): number {
        return this.app.canvas.font(Constants.NODE_FONT).getContext().measureText(pin.formattedName).width + PinControl.PIN_NAME_PADDING_LEFT;
    }

    public getPinAbsolutePosition(): Vector2 {
        let position = this.getAbsolutPosition();
        position.y += this.height * 0.5;

        if (this.pinProperty.direction === PinDirection.Output) {
            position.x += (this.width || this.size.x) - PinControl.PINS_PADDING_HORIZONTAL;
            // if (this.pinProperty.category === PinCategory.delegate)
            //     position.x += 8;
        } else {
            position.x += PinControl.PINS_PADDING_HORIZONTAL;
        }

        return position;
    }
}
