import { CustomProperty } from "../custom-property";
import { PinAttributeDomain } from "./pin-attribute-domain";
import { PinCategory, PinSubCategory, PinType } from "./pin-category";
import { PinDefaultInput } from "./pin-default-input";
import { PinDirection } from "./pin-direction";
import { PinShape } from "./pin-shape";
import { PinLink } from "./pin-link";

export enum PinState {
    NONE = 0,
    MUTED = 1 << 0,
    HIDDEN = 1 << 1,
    ENABLED = 1 << 2,
    OPTIONS = 1 << 3,
    ADVANCED = 1 << 4,
    LATENT = 1 << 5,
    DEPRECATED = 1 << 6,
    SELECTED = 1 << 7,
    NAMELESS = 1 << 8,
    VALUELESS = 1 << 9,
    UNAVAILABLE = 1 << 10,
    MULTI = 1 << 11,
    GIZOM = 1 << 12,
    LINKED = 1 << 13,
    DEFAULT = ENABLED
}

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
    
    attributeDomain: PinAttributeDomain;

    //linkedTo: PinLink[];
    persistentGUID: string;
    
    valueType?: string;
    
    defaultValue: any;
    defaultValueControlClass: any;
    
    optionView: boolean;
    hideName: boolean;
    hidden: boolean;
    enabled: boolean;

    defaultAttributeName: string;
    defaultInput: PinDefaultInput;

    constructor(nodeName: string) {
        super();
        this.nodeName = nodeName;
        this.direction = PinDirection.Input;
    }

    get isLinked(): boolean {
        return (this.state & PinState.LINKED) == PinState.LINKED;  //(this.linkedTo && this.linkedTo.length > 0);
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

    public getUniqueName() {
        return this.id;
    }
}
