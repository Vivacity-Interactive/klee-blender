import { decodeHtmlText } from "../utils/text-utils";

export class Enum {
    public value: string | number;
    public options: {[key: string | number]: string | number};

    constructor(value: string | number, options: {[key: string | number]: string | number}) {
        this.value = value;
        this.options = options;
    }

    get title(): string {
        try {
            return decodeHtmlText(String(this.options[this.value]));
        } catch { return String(this.value); }
    }
}