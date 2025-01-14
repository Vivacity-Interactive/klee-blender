import { Canvas2D } from "../canvas";
import { PinCategory, PinType } from "../data/pin/pin-enums";
import { PinLink } from "../data/pin/pin-link";
import { PinShape } from "../data/pin/pin-enums";
import { Vector2 } from "../math/vector2";
import { Control } from "./control";
import { DrawableControl } from "./interfaces/drawable";
import { PinControl } from "./pin-control";
import { UserControl } from "./user-control";
import { ColorUtils } from "./utils/color-utils";

export class NodeConnectionControl extends UserControl {

    public link: PinLink;

    private pinStart: PinControl;
    private pinEnd: PinControl;

    private pinStartPosition: Vector2;
    private pinEndPosition: Vector2;

    private curveValue: number;
    private color: string;
    private color2: string;
    private lineWidth: number;
    private lineDash: number[] = [];

    constructor(pinStart: PinControl, pinEnd: PinControl) {
        super(0, 0, -1);

        this.pinStart = pinStart;
        this.pinEnd = pinEnd;

        this.pinStartPosition = this.pinStart.getPinAbsolutePosition();
        this.pinEndPosition = this.pinEnd.getPinAbsolutePosition();
        let difference = this.pinEndPosition.subtract(this.pinStartPosition);

        let distance = Math.sqrt((difference.x * difference.x) + (difference.y * difference.y)) - 12;
        this.curveValue = distance * 0.4;
        this.color = ColorUtils.getPinColor(this.pinStart.pinProperty);
        this.color2 =ColorUtils.getPinColor(this.pinEnd.pinProperty);

        this._resolveDash();

        this.lineWidth = 1.5;
    }

    get start() { return this.pinStart; }
    
    get end() { return this.pinEnd; }

    private _resolveDash() {
        const bDash = false
            || this.pinEnd.pinProperty.shape === PinShape.DIAMOND
            || this.pinEnd.pinProperty.shape === PinShape.DIAMOND_DOT
            || this.pinStart.pinProperty.shape === PinShape.DIAMOND
            || this.pinStart.pinProperty.shape === PinShape.DIAMOND_DOT;
        
        if (bDash) { this.lineDash = [3,2]; }
    }

    onDraw(canvas: Canvas2D): void {
        this.pinStartPosition = this.pinStart.getPinAbsolutePosition();
        this.pinEndPosition = this.pinEnd.getPinAbsolutePosition();
        let difference = this.pinEndPosition.subtract(this.pinStartPosition);
        let distance = Math.sqrt((difference.x * difference.x) + (difference.y * difference.y)) - 12;
        this.curveValue = distance * 0.4;
        
        let gradient = canvas.getContext().createLinearGradient(this.pinStartPosition.x, this.pinStartPosition.y, this.pinEndPosition.x, this.pinEndPosition.y);
        gradient.addColorStop(0, this.color);
        gradient.addColorStop(1, this.color2);

        canvas.lineWidth(this.lineWidth)
        .beginPath()
        .moveTo(this.pinStartPosition.x, this.pinStartPosition.y)
        .strokeStyle(gradient)
        .lineTo(this.pinStartPosition.x + 6, this.pinStartPosition.y)
        .bezierCurveTo(
            this.pinStartPosition.x + this.curveValue + 6,
            this.pinStartPosition.y,
            this.pinEndPosition.x - this.curveValue - 6,
            this.pinEndPosition.y,
            this.pinEndPosition.x - 6,
            this.pinEndPosition.y
        )
        .lineTo(this.pinEndPosition.x, this.pinEndPosition.y)
        .setLineDash(this.lineDash)
        .stroke();
    }
}
