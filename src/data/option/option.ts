import { CustomProperty } from "../custom-property";

export class OptionProperty extends CustomProperty {
    name: string;
    friendlyName: string;
    
    nodeName: string;
    toolTip: string;
    defaultValue: any;
    //defaultValueControlClass: any;

    constructor(nodeName: string) {
        super();
        this.nodeName = nodeName;
    }

    public get formattedName(): string {
        if (this.isNameless) { return ''; }
        if (this.friendlyName) {
            return this.friendlyName;
        }

        return this.name;
    }

    public get shouldDrawDefaultValueBox(): boolean {
        return true;
    }
}