import { PropertySubCategory, PropertyType } from "./custom-property-enums";

export class Value {
    public value: number | boolean;
    public type: PropertyType;
    public unit: PropertySubCategory;
    public decimal: number;
    public min: number;
    public max: number;

    constructor(value: number | boolean, type: PropertyType, unit: PropertySubCategory = PropertySubCategory.None, min:number = 0, max: number = 1, decimal:number = 3) {
        this.value = value;
        this.type = type;
        this.unit = unit;
        this.decimal = decimal;
        this.min = min;
        this.max = max;
    }

    get ratio(): number { return (Number(this.value) - this.min)/(this.max - this.min); }

    get formatted(): string
    {
        let _format = null;
        let _unit = this.unit;

        switch(this.type) {
            case PropertyType.ROTATION: 
                _format = String(this.value ? Number(this.value).toFixed(this.decimal) : this.value); 
                _unit = PropertySubCategory.Angle;
                    break;
            case PropertyType.VECTOR: ;
            case PropertyType.VALUE: _format = String(Number(this.value).toFixed(this.decimal)); break;
            case PropertyType.BOOLEAN: _format = this.value ? "True" : "False"; break;
            default: _format = String(this.value);
        }

        switch(_unit) {
            case PropertySubCategory.XYZ: ;
            case PropertySubCategory.Angle: ;
            case PropertySubCategory.Euler: _format += "\u00b0"; break;
            case PropertySubCategory.ColorTemperature: _format += " K"; break;
            case PropertySubCategory.Wavelength: _format += " pm"; break;
            case PropertySubCategory.Frequency: _format += " Hz"; break;
            case PropertySubCategory.TimeAbsolute: _format += " ms"; break;
            case PropertySubCategory.Percentage: _format += "\u0025"; break;
            case PropertySubCategory.Distance: ;
            case PropertySubCategory.Translation: _format += " m"; break;
            case PropertySubCategory.Velocity: _format += " m/s"; break;
            case PropertySubCategory.Acceleration: _format += " m/s\u00B2"; break;
            default: ;
        }
        return _format;
    }
}