import { Color } from "../data/color";
import { PinType } from "../data/pin/pin-enums";

type ValueConstrutor = (raw: any) => any

const _passOn: ValueConstrutor = (value: any): any => value;
const _asColor: ValueConstrutor = (value: any): any => new Color(value);

export enum CustomValueClass {

}

export class UserUtils {
    public static getUserControl(key:string): any {
        const _key = CustomValueClass[key as keyof ValueConstrutor];
        const _class = LOT_VALUE[_key] ?? null;
        return _class;
    }

    public static resolveUserControl(key: string): any {
        const _unknown = null;
        
        for (const _key in LOT_VALUE_RESOLVE) {
            const regex: RegExp = LOT_VALUE_RESOLVE[_key];
            const bMatch = regex && regex.test(key);
            
            if (bMatch) {
                return LOT_VALUE[_key] ?? _unknown;
            }
        }
        
        return _unknown;
    }
}

export const LOT_VALUE: { [key in CustomValueClass | PinType]: ValueConstrutor } = {
    [PinType.VALUE]: _passOn,
    [PinType.INT]: _passOn,
    [PinType.BOOLEAN]: _passOn,
    [PinType.VECTOR]: _passOn,
    [PinType.ROTATION]: _passOn,
    [PinType.MATRIX]: _passOn,
    [PinType.STRING]: _passOn,
    [PinType.RGBA]: _asColor,
    [PinType.SHADER]: _passOn,
    [PinType.OBJECT]: _passOn,
    [PinType.GEOMETRY]: _passOn,
    [PinType.COLLECTION]: _passOn,
    [PinType.TEXTURE]: _passOn,
    [PinType.MATERIAL]: _passOn,
    [PinType.MENU]: _passOn, //ComboBoxControl
    [PinType.IMAGE]: _passOn, //CreateBoxControl
    [PinType.CUSTOM]: _passOn,
    [PinType._UNKNOWN]: _passOn
}

export const LOT_VALUE_RESOLVE:  Partial<{ [key in CustomValueClass | PinType]: RegExp }> = {

};