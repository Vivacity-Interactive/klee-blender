import { PinType } from "../../data/pin/pin-category";
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

export const LOT_USER_CONTROL: { [key in CustomUserClass | PinType]: UserControlConstrutor } = {
    [PinType.VALUE]: TextBoxControl,//NumberBoxControl
    [PinType.INT]: TextBoxControl,//NumberBoxControl
    [PinType.BOOLEAN]: CheckBoxControl,
    [PinType.VECTOR]: TextBoxControl,//StructBoxControl,
    [PinType.ROTATION]: TextBoxControl,//StructBoxControl,
    [PinType.MATRIX]: null,//StructBoxControl,
    [PinType.STRING]: TextBoxControl,
    [PinType.RGBA]: ColorBoxControl,
    [PinType.SHADER]: null,
    [PinType.OBJECT]: TextBoxControl,//ReferenceBoxControl
    [PinType.GEOMETRY]: null,
    [PinType.COLLECTION]: TextBoxControl,//ReferenceBoxControl
    [PinType.TEXTURE]: null,
    [PinType.MATERIAL]: TextBoxControl,//ReferenceBoxControl
    [PinType.MENU]: TextBoxControl,//ComboBoxControl
    [PinType.IMAGE]: TextBoxControl,//AssetBoxControl
    [PinType.CUSTOM]: null,
    [PinType._UNKNOWN]: null
}

export const LOT_USER_RESOLVE_CONTROL:  Partial<{ [key in CustomUserClass | PinType]: RegExp }> = {

};