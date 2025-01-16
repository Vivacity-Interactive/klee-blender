import { Color } from "../data/color";
import { PropertyType } from "../data/custom-property-enums";
import { Graph } from "../data/graph";
import { decodeHtmlText } from "./text-utils";

type ValueConstrutor = (raw: any, graph:Graph) => any

const _passOn: ValueConstrutor = (value: any, graph:Graph): any => value;
const _asColor: ValueConstrutor = (value: any, graph:Graph): any => new Color(value);
const _asEnum: ValueConstrutor = (value: any, graph:Graph): any => decodeHtmlText(graph._enums[value[1]][value[0]])
const _asString: ValueConstrutor = (value: any, graph:Graph): any => decodeHtmlText(value)

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

export const LOT_VALUE: { [key in CustomValueClass | PropertyType]: ValueConstrutor } = {
    [PropertyType.VALUE]: _passOn,
    [PropertyType.INT]: _passOn,
    [PropertyType.BOOLEAN]: _passOn,
    [PropertyType.VECTOR]: _passOn,
    [PropertyType.ROTATION]: _passOn,
    [PropertyType.MATRIX]: _passOn,
    [PropertyType.STRING]: _asString,
    [PropertyType.RGBA]: _asColor,
    [PropertyType.SHADER]: _passOn,
    [PropertyType.OBJECT]: _passOn,
    [PropertyType.GEOMETRY]: _passOn,
    [PropertyType.COLLECTION]: _passOn,
    [PropertyType.TEXTURE]: _passOn,
    [PropertyType.MATERIAL]: _passOn,
    [PropertyType.MENU]: _passOn, //ComboBoxControl
    [PropertyType.IMAGE]: _passOn, //CreateBoxControl
    [PropertyType.CUSTOM]: _passOn,
    [PropertyType._UNKNOWN]: _passOn,
    [PropertyType.ENUM]: _asEnum,
    [PropertyType.POINTER]:_passOn
}

export const LOT_VALUE_RESOLVE:  Partial<{ [key in CustomValueClass | PropertyType]: RegExp }> = {

};