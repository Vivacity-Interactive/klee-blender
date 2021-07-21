import { Canvas2D } from "../canvas";
import { Constants } from "../constants";
import { PinCategory, PinDirection, PinProperty } from "../data/custom-property";
import { NodeObject } from "../data/node-object";
import { Control } from "./control";
import { PinControl } from "./pin-control";

export class NodeControlBase extends Control {

    private _node: NodeObject;
    protected headerHeight: number;

    protected minHeight: number;
    protected minWidth: number;

    protected width: number;
    protected height: number;

    protected _inputPins: Array<PinControl>;
    protected _outputPins: Array<PinControl>;

    constructor(node: NodeObject) {
        super(node.nodePosX, node.nodePosY);
        this._node = node;
        this._inputPins = [];
        this._outputPins = [];
    }

    initialize(): void { 
        let pinRows = Math.max(this.getPinRows(this._inputPins), this.getPinRows(this._outputPins));
        let preferedHeight = pinRows * 24 + this.headerHeight + 6;
        if (preferedHeight > this.height) {
            this.height = preferedHeight;
        }

        let inputWidth = this.getMaxPinTextWidth(this._inputPins) + 25;
        let outputWidth = this.getMaxPinTextWidth(this._outputPins) + 25;

        let preferedWidth = inputWidth + outputWidth + 40;
        if (preferedWidth > this.width) {
            this.width = preferedWidth;
        }

        this.calculatePinPositions(this._inputPins);
        this.calculatePinPositions(this._outputPins);
    }

    get node(): NodeObject {
        return this._node;
    }

    protected createPins() {
        let properties = this.node.customProperties;

        for (let i = 0; i < properties.length; ++i) {
            if (properties[i] instanceof PinProperty) {
                let pinProperty = properties[i] as PinProperty;
                if (pinProperty.isHidden)
                    continue;

                let pin = new PinControl(this, pinProperty);

                if (pinProperty.direction == PinDirection.EGPD_Output) {
                    this._outputPins.push(pin);
                } else {
                    this._inputPins.push(pin);
                }
            }
        }
    }

    protected drawPins(canvas: Canvas2D) {
        for (let i = 0; i < this._inputPins.length; ++i) {
            this._inputPins[i].draw(canvas);
        }

        for (let i = 0; i < this._outputPins.length; ++i) {
            this._outputPins[i].draw(canvas);
        }
    }

    private calculatePinPositions(pins: Array<PinControl>) {
        let x = 0;
        let y = this.headerHeight - 10;

        for (let i = 0; i < pins.length; ++i) {
            if (pins[i].pinProperty.isKnotPin) {
                pins[i].position.x = 0;
                pins[i].position.y = 0;
                continue;
            }

            if (pins[i].pinProperty.isDelegatePin) {
                pins[i].position.x = this.width - 12;
                pins[i].position.y = 12;
                continue;
            }

            y = y + 24;
            x = 20;

            pins[i].position.y = y;
            

            if (pins[i].pinProperty.direction === PinDirection.EGPD_Output)
                x = this.width - 20;
        
            pins[i].position.x = x;
            
        }
    }

    private getMaxPinTextWidth(pins: Array<PinControl>): number {
        let width = 0;
        this.getContext().font = Constants.FONT_PIN;
        

        for (let i = 0; i < pins.length; ++i) {
            let textWidth = this.getContext().measureText(pins[i].pinProperty.getPinName()).width;

            if (textWidth > width) {
                width = textWidth;
            }
        }

        return width;
    }

    private getPinRows(pins: PinControl[]): number {
        let count = 0;
        for (let i = 0; i < pins.length; ++i) {
            if (pins[i].pinProperty.pinCategory !== PinCategory.delegate)
                count++;
        }

        return count;
    }

    get inputPins() {
        return this._inputPins;
    }

    get outputPins() {
        return this._outputPins;
    }
}