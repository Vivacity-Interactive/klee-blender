import { CustomProperty } from "../custom-property";
import { PinAttributeDomain } from "./pin-attribute-domain";
import { PinCategory, PinSubCategory } from "./pin-category";
import { PinDefaultInput } from "./pin-default-input";
import { PinDirection } from "./pin-direction";
import { PinLink } from "./pin-link";

export class PinProperty extends CustomProperty {

    id: string;
    name: string;
    friendlyName: string;
    category: PinCategory;
    subCategory: PinSubCategory;

    nodeName: string;
    toolTip: string;

    direction: PinDirection;
    
    attributeDomain: PinAttributeDomain;

    linkedTo: PinLink[];
    persistentGUID: string;
    hidden: boolean;
    enabled: boolean;

    valueType?: string;

    defaultValue: any;
    defaultValueControlClass: any;
    optionView: boolean;
    hideName: boolean;

    defaultAttributeName: string;
    defaultInput: PinDefaultInput;

    constructor(nodeName: string) {
        super();
        this.nodeName = nodeName;
        this.direction = PinDirection.EGPD_Input;
    }

    get isLinked(): boolean {
        return (this.linkedTo && this.linkedTo.length > 0);
    }

    public get formattedName(): string {
        if (this.hideName) { return ''; }
        if (this.friendlyName) {
            return this.friendlyName;
        }

        return this.name;
    }

    public get shouldDrawDefaultValueBox(): boolean {
        return (!this.isLinked && this.direction !== PinDirection.EGPD_Output && this.defaultValue != undefined);
    }

    public getUniqueName() {
        return this.nodeName + " " + this.id;
    }
}
