import { CustomProperty } from "../custom-property";
import { PinDirection, PinShape } from "./pin-enums";

export class PinProperty extends CustomProperty {
    name: string;
    friendlyName: string;
    
    shape: PinShape;
    nodeName: string; // TODO not used atm
    toolTip: string;
    direction: PinDirection;
    valueType: string;
    defaultValue: any;

    constructor(nodeName: string) {
        super();
        this.nodeName = nodeName;  // TODO not used atm
        this.direction = PinDirection.Input;
    }

    get isValued(): boolean { 
        return super.isValued
            && (this.direction & PinDirection.Output) !== PinDirection.Output;
    }

    public get formattedName(): string {
        if (this.isNameless) { return ''; }
        if (this.friendlyName) {
            return this.friendlyName;
        }

        return this.name;
    }

    public get shouldDrawDefaultValueBox(): boolean {
        return (!this.isLinked && this.direction !== PinDirection.Output && this.defaultValue != undefined);
    }
}
