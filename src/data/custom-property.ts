import { PropertyState, PropertySubCategory, PropertyType } from "./custom-property-enums";

export class CustomProperty {
    id: string|number;
    state: PropertyState;
    subCategory: PropertySubCategory;
    type: PropertyType;
    fixedType: string;
    _type: PropertyType;

    get isLinked(): boolean {
        return (this.state & PropertyState.LINKED) == PropertyState.LINKED;  //(this.linkedTo && this.linkedTo.length > 0);
    }

    get isValued(): boolean {
        return true
            && (this.state & PropertyState.UNAVAILABLE) !== PropertyState.UNAVAILABLE
            && (this.state & PropertyState.LINKED) !== PropertyState.LINKED
            && (this.state & PropertyState.VALUELESS) !== PropertyState.VALUELESS;
    }

    get isNameless(): boolean {
        return (this.state & PropertyState.NAMELESS) == PropertyState.NAMELESS;
    }

    get isHidden(): boolean {
        return false
            || (this.state & PropertyState.UNAVAILABLE) == PropertyState.UNAVAILABLE
            || (this.state & PropertyState.HIDDEN) == PropertyState.HIDDEN
    }
}
