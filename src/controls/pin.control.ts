import { Canvas2D } from "../canvas";
import { Constants } from "../constants";
import { PinCategory } from "../data/pin/pin-category";
import { PinContainerType } from "../data/pin/pin-container-type";
import { PinDirection } from "../data/pin/pin-direction";
import { PinProperty } from "../data/pin/pin-property";
import { Vector2 } from "../math/vector2";
import { NodeConnectionControl } from "./node-connection.control";
import { NodeControl } from "./nodes/node.control";
import { UserControl } from "./user-control";
import { ColorUtils } from "./utils/color-utils";
import { IconLibrary } from "./utils/icon-library";


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

    private icon?: Path2D;
    private secondaryIcon?: Path2D;

    private connections: Array<NodeConnectionControl> = [];

    constructor(parentPosition: Vector2, pin: PinProperty) {
        super(0, 0);
        this._pinProperty = pin;
        this.hidden = false;

        this._isInput = this._pinProperty.direction !== PinDirection.EGPD_Output;
        this._color = ColorUtils.getPinColor(this._pinProperty);
        if (this._pinProperty.valueType)
            this._secondaryColor = ColorUtils.getPinColorByCategory(this._pinProperty.valueType as PinCategory);

        
        this.width = 0;
        this.height = 27;

        this.visible = !pin.hidden;
        this.category = pin.category;

        this.initPinIcons();
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
    

    private initPinIcons() {
        switch (this._pinProperty.containerType) {
            case PinContainerType.Array:
                this.icon = (this._pinProperty.isLinked) ? new Path2D(IconLibrary.PIN_ARRAY_CONNECTED) : new Path2D(IconLibrary.PIN_ARRAY_DISCONNECTED);
                break;
            case PinContainerType.Set:
                this.icon = new Path2D(IconLibrary.PIN_SET);
                break;
            case PinContainerType.Map:
                this.icon = new Path2D(IconLibrary.PIN_MAP_KEY);
                this.secondaryIcon = new Path2D(IconLibrary.PIN_MAP_VALUE);
                break;
            case PinContainerType.None:
            default:
                this.icon = undefined;
                break;
        }

        // Overwrite only if there is no icon (Container icons stay even when they are references)
        if (this.icon === undefined && this._pinProperty.isReference) {
            if (this._pinProperty.isLinked)
                this.icon = new Path2D(IconLibrary.PIN_REFERENCE_CONNECTED);
            else
                this.icon = new Path2D(IconLibrary.PIN_REFERENCE_DISCONNECTED);
        }
    }

    get pinProperty(): PinProperty {
        return this._pinProperty;
    }

    override set parent(value: UserControl) {
        this.controlParent = value;

        let nodeControl = this.findParent(NodeControl) as NodeControl;
        if (nodeControl) {
            if (this.pinProperty.advancedView == true && !nodeControl.showAdvanced && !this.pinProperty.isLinked) {
                this.visible = false;
            }
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

        let paddingX = (this.pinProperty.direction === PinDirection.EGPD_Output) ? -this.padding.right : this.padding.left;
        canvas.translate(paddingX, Math.floor(this.height * 0.5));

        switch (pinCategory) {
            case PinCategory.exec:
                this.drawExecutionPin(canvas);
                break;
            case PinCategory.delegate:
                this.drawDelegatePin(canvas);
                break;
            default:
                this.drawPin(canvas);
        }

        canvas.restore();
    }

    drawPinIcon(canvas: Canvas2D, icon: Path2D) {
        const pinX = Math.floor(this.getPinX());

        canvas.fillStyle(this._color)
        .translate(pinX - 7.5, -7.5)
        .fill(this.icon, 'evenodd');

        if (this.secondaryIcon !== undefined) {
            canvas.fillStyle(this._secondaryColor)
            .fill(this.secondaryIcon, 'evenodd');
        }
    }

    private drawPin(canvas: Canvas2D) {
        let textX = this.setupTextDrawing(canvas);
        const pinX = this.getPinX();

        canvas.fillText(this._pinProperty.formattedName, textX, 4);
        

        if (this.icon === undefined) {
            canvas.fillStyle(this._color)
            .fillCircle(pinX + 6, 0, 2.3);

            if (this._pinProperty.isLinked) {
                canvas.fillCircle(pinX, 0, 6)
            } else {
                canvas.strokeStyle(this._color)
                .lineWidth(2)
                .strokeCircle(pinX, 0, 4.8)

                this.drawDefaultValueBox(canvas);
            }

            canvas.strokeStyle("#000")
            .lineWidth(.5)
            .strokeCircle(pinX, 0, 6);
        } else {
            if (this.icon)
                this.drawPinIcon(canvas, this.icon)            
        }
    }

    private drawExecutionPin(canvas: Canvas2D) {
        canvas.save();

        let textX = this.setupTextDrawing(canvas);
        canvas.fillText(this._pinProperty.formattedName, textX, 4);
        
        if (this._pinProperty.formattedName) {
            const textX = this.setupTextDrawing(canvas);
            canvas.fillText(this._pinProperty.formattedName, textX, 4);
        }

        canvas.translate(this.getPinX(), -7);

        canvas.strokeStyle('#fff')
        .fillStyle('#fff')
        .lineWidth(1.1)
        .beginPath()
        .moveTo(-3, 0)
        .lineTo(1, 0)
        .lineTo(8, 6)
        .lineTo(8, 8)
        .lineTo(1, 14)
        .lineTo(-3, 14)
        .lineTo(-4, 13)
        .lineTo(-4, 1)
        .lineTo(-3, 0)
        .closePath();

        if (this.pinProperty.isLinked)
            canvas.fill();
        else
            canvas.stroke();

        canvas.restore();
    }

    private drawDelegatePin(canvas: Canvas2D) {
        canvas.save()

        let textX = this.setupTextDrawing(canvas);
        let pinX = this.getPinX();

        if(!this.pinProperty.showInHead) {
            pinX -= 4;
        }

        // Draw pin text
        canvas.fillText(this._pinProperty.formattedName, textX, 4);

        // Set pin icon style
        canvas.fillStyle(this._color).strokeStyle(this._color).lineWidth(2);

        if (this.pinProperty.isLinked) {
            canvas.roundedRectangle(pinX, -5, 11, 11, 3).fill();
        } else {
            canvas.roundedRectangle(pinX, -5, 10, 10, 3).stroke();
        }

        canvas.restore();
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

        if (this.pinProperty.direction === PinDirection.EGPD_Output) {
            position.x += (this.width || this.size.x) - PinControl.PINS_PADDING_HORIZONTAL;
            if (this.pinProperty.category === PinCategory.delegate)
                position.x += 8;
        } else {
            position.x += PinControl.PINS_PADDING_HORIZONTAL;
        }

        return position;
    }
}
