import { CustomProperty } from "../custom-property";
import { PinCategory, PinSubCategory, PinType, PinDirection, PinShape, PinState } from "./pin-enums";

export class PinProperty extends CustomProperty {

    id: string|number;
    name: string;
    friendlyName: string;
    category: PinCategory;
    subCategory: PinSubCategory;
    type: PinType;
    shape: PinShape;
    state: PinState;
    nodeName: string;
    toolTip: string;
    direction: PinDirection;
    //persistentGUID: string;
    valueType?: string;
    defaultValue: any;
    //defaultValueControlClass: any;
    optionView: boolean;
    hideName: boolean;
    hidden: boolean;
    enabled: boolean;

    constructor(nodeName: string) {
        super();
        this.nodeName = nodeName;
        this.direction = PinDirection.Input;
    }

    get isLinked(): boolean {
        return (this.state & PinState.LINKED) == PinState.LINKED;  //(this.linkedTo && this.linkedTo.length > 0);
    }

    get isValued(): boolean {
        return true
            && (this.state & PinState.UNAVAILABLE) !== PinState.UNAVAILABLE
            && (this.state & PinState.LINKED) !== PinState.LINKED
            && (this.state & PinState.VALUELESS) !== PinState.VALUELESS
            && (this.direction & PinDirection.Output) !== PinDirection.Output;
    }

    public get formattedName(): string {
        if (this.hideName) { return ''; }
        if (this.friendlyName) {
            return this.friendlyName;
        }

        return this.name;
    }

    public get shouldDrawDefaultValueBox(): boolean {
        return (!this.isLinked && this.direction !== PinDirection.Output && this.defaultValue != undefined);
    }
}
