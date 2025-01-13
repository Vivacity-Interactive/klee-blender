import { Canvas2D } from "../canvas";
import { PinCategory, PinType } from "../data/pin/pin-category";
import { PinDirection } from "../data/pin/pin-direction";
import { PinLink } from "../data/pin/pin-link";
import { PinShape } from "../data/pin/pin-shape";
import { Control } from "./control";
import { DrawableControl } from "./interfaces/drawable";
import { PinControl } from "./pin-control";
import { ColorUtils } from "./utils/color-utils";

export class NodePartialConnectionControl extends Control implements DrawableControl {

    private static readonly LINE_LENGTH = 80;

    public link: PinLink;

    private _pin: PinControl;
    private _isDirectionOutput: boolean;
    
    private _color: string;
    private _lineWidth: number;
    private _lineDash: number[] = [30, 4, 2.5, 4, 2.5, 4, 2.5];

    constructor(pin: PinControl) {
        super(pin.getAbsolutPosition().x, pin.getAbsolutPosition().y, -1);

        this._pin = pin;

        this._color = ColorUtils.getPinColor(this._pin.pinProperty);
        this._isDirectionOutput = this._pin.pinProperty.direction == PinDirection.Output;
        //this._lineWidth = (this._pin.pinProperty.category === PinCategory.exec) ? 2.5 : 1.5;
        this._lineWidth = 1.5;

        this._resolveDash()
    }

    private _resolveDash() {
            const bDash = false
                || this._pin.pinProperty.shape === PinShape.DIAMOND
                || this._pin.pinProperty.shape === PinShape.DIAMOND_DOT
            
            if (bDash) { this._lineDash = [2,3, 2,3, 2,3, 2,3, 10, 4, 2.5, 4, 2.5, 4, 2.5, 30] }
        }

    draw(canvas: Canvas2D): void {
        canvas.save();
        canvas.translate(this._pin.getPinAbsolutePosition().x, this._pin.getPinAbsolutePosition().y);

        canvas.lineWidth(this._lineWidth)
        .beginPath()
        .setLineDash(this._lineDash);

        if (this._isDirectionOutput) {
            canvas.moveTo(6, 0)
            .lineTo(NodePartialConnectionControl.LINE_LENGTH, 0);
        } else {
            canvas.moveTo(-6, 0)
            .lineTo(-NodePartialConnectionControl.LINE_LENGTH, 0);
        }

        canvas.strokeStyle(this._color)
        .stroke();

        canvas.restore();
    }
}
