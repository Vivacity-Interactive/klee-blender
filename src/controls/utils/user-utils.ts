import { PropertySubCategory, PropertyType } from "../../data/custom-property-enums";
import { AssetBoxControl } from "../asset-box-control";
import { CheckBoxControl } from "../check-box-control";
import { ColorBoxControl } from "../color-box-control";
import { EnumBoxControl } from "../enum-box-control";
import { ReferenceBoxControl } from "../reference-box-control";
import { StructBoxControl } from "../struct-box-control";
import { TextBoxControl } from "../text-box-control";
import { UserControl } from "../user-control";
import { ValueBoxControl } from "../value-box-control";

type UserControlConstrutor = new (...parms: any) => UserControl

export type ValueType = { type: PropertyType, unit: PropertySubCategory, min:number, max: number, decimal:number }

export enum CustomUserClass {
    // Enum Control
    // Color Ramp Control
    // RGB Curve Control
    // Color Picker Control
}

export class UserUtils {
    public static getUserControl(key:string): UserControlConstrutor {
        const _key = CustomUserClass[key as keyof CustomUserClass];
        const _class = LOT_USER_CONTROL[_key] ?? null;
        return _class;
    }

    public static resolveUserControl(key: string): UserControlConstrutor {
        const _unknown = null;
        
        for (const _key in LOT_USER_RESOLVE_CONTROL) {
            const regex: RegExp = LOT_USER_RESOLVE_CONTROL[_key];
            const bMatch = regex && regex.test(key);
            
            if (bMatch) {
                return LOT_USER_CONTROL[_key] ?? _unknown;
            }
        }
        
        return _unknown;
    }
}

export const LOT_USER_CONTROL: { [key in CustomUserClass | PropertyType]: UserControlConstrutor } = {
    [PropertyType.VALUE]: ValueBoxControl,
    [PropertyType.INT]: ValueBoxControl,
    [PropertyType.BOOLEAN]: CheckBoxControl,
    [PropertyType.VECTOR]: StructBoxControl,
    [PropertyType.ROTATION]: StructBoxControl,
    [PropertyType.MATRIX]: null, //StructBoxControl,
    [PropertyType.STRING]: TextBoxControl,
    [PropertyType.RGBA]: ColorBoxControl,
    [PropertyType.SHADER]: null,
    [PropertyType.OBJECT]: ReferenceBoxControl,
    [PropertyType.GEOMETRY]: null,
    [PropertyType.COLLECTION]: ReferenceBoxControl,
    [PropertyType.TEXTURE]: null,
    [PropertyType.MATERIAL]: ReferenceBoxControl,
    [PropertyType.MENU]: EnumBoxControl, //Enu
    [PropertyType.IMAGE]: AssetBoxControl,
    [PropertyType.CUSTOM]: null,
    [PropertyType._UNKNOWN]: null,
    [PropertyType.ENUM]: EnumBoxControl, //282828
    [PropertyType.POINTER]: TextBoxControl
}

export const LOT_USER_RESOLVE_CONTROL:  Partial<{ [key in CustomUserClass | PropertyType]: RegExp }> = {

};