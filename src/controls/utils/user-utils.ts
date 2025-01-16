import { PropertyType } from "../../data/custom-property-enums";
import { CheckBoxControl } from "../check-box-control";
import { ColorBoxControl } from "../color-box-control";
import { StructBoxControl } from "../struct-box-control";
import { TextBoxControl } from "../text-box-control";
import { UserControl } from "../user-control";

type UserControlConstrutor = new (...parms: any) => UserControl

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
    [PropertyType.VALUE]: TextBoxControl, //NumberBoxControl
    [PropertyType.INT]: TextBoxControl, //NumberBoxControl
    [PropertyType.BOOLEAN]: CheckBoxControl,
    [PropertyType.VECTOR]: TextBoxControl, //StructBoxControl,
    [PropertyType.ROTATION]: TextBoxControl, //StructBoxControl,
    [PropertyType.MATRIX]: null, //StructBoxControl,
    [PropertyType.STRING]: TextBoxControl,
    [PropertyType.RGBA]: ColorBoxControl,
    [PropertyType.SHADER]: null,
    [PropertyType.OBJECT]: TextBoxControl, //ReferenceBoxControl
    [PropertyType.GEOMETRY]: null,
    [PropertyType.COLLECTION]: TextBoxControl, //ReferenceBoxControl
    [PropertyType.TEXTURE]: null,
    [PropertyType.MATERIAL]: TextBoxControl, //ReferenceBoxControl
    [PropertyType.MENU]: TextBoxControl, //ComboBoxControl
    [PropertyType.IMAGE]: TextBoxControl, //AssetBoxControl
    [PropertyType.CUSTOM]: null,
    [PropertyType._UNKNOWN]: null,
    [PropertyType.ENUM]: TextBoxControl,
    [PropertyType.POINTER]: TextBoxControl
}

export const LOT_USER_RESOLVE_CONTROL:  Partial<{ [key in CustomUserClass | PropertyType]: RegExp }> = {

};