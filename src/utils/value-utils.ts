import { Color } from "../data/color";
import { PropertyType } from "../data/custom-property-enums";
import { Enum } from "../data/Enum";
import { Graph } from "../data/graph";
import { decodeHtmlText } from "./text-utils";

export const LOT_VECTOR_ELEMENT_NAME: Array<string> = [
    "X",
    "Y",
    "Z",
    "W"
]

type _KeyValuePair = { key: string, value: any }

const _toKVArrLOT = (arr:any[], lot:Array<string>): _KeyValuePair[] => { return arr.map((x: any, i: number): _KeyValuePair => { return { key: lot[i%arr.length], value: x } }); }
const _toKVArr = (arr:any[]): _KeyValuePair[] => { return arr.map((x:any): _KeyValuePair => { return { key: "", value: x }; }); }

type ValueConstrutor = (raw: any, graph:Graph) => any

const _passOn: ValueConstrutor = (value: any, graph:Graph): any => value;
const _asColor: ValueConstrutor = (value: any, graph:Graph): any => new Color(value);
const _asEnum: ValueConstrutor = (value: any, graph:Graph): any => new Enum(value[0], graph._enums[value[1]]); //decodeHtmlText(graph._enums[value[1]][value[0]])
const _asString: ValueConstrutor = (value: any, graph:Graph): any => decodeHtmlText(value);
const _asVector: ValueConstrutor = (value: any, graph:Graph): any => (value.length <= 4 ? _toKVArrLOT(value, LOT_VECTOR_ELEMENT_NAME) : _toKVArr(value));
const _asEuler: ValueConstrutor = (value: any, graph:Graph): any => [{ key: LOT_VECTOR_ELEMENT_NAME[0], value: value[0] }, { key: LOT_VECTOR_ELEMENT_NAME[1], value: value[1] }, { key: LOT_VECTOR_ELEMENT_NAME[2], value: value[2] }]
const _asObject: ValueConstrutor = (value: any, graph:Graph): any => (value == 'null' || !value) ? "" : value;

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
    [PropertyType.VECTOR]: _asVector,
    [PropertyType.ROTATION]: _asEuler,
    [PropertyType.MATRIX]: _passOn,
    [PropertyType.STRING]: _asString,
    [PropertyType.RGBA]: _asColor,
    [PropertyType.SHADER]: _passOn,
    [PropertyType.OBJECT]: _asObject,
    [PropertyType.GEOMETRY]: _passOn,
    [PropertyType.COLLECTION]: _asObject,
    [PropertyType.TEXTURE]: _passOn,
    [PropertyType.MATERIAL]: _asObject,
    [PropertyType.MENU]: _passOn, //ComboBoxControl
    [PropertyType.IMAGE]: _asObject, //CreateBoxControl
    [PropertyType.CUSTOM]: _passOn,
    [PropertyType._UNKNOWN]: _passOn,
    [PropertyType.ENUM]: _asEnum,
    [PropertyType.POINTER]:_passOn
}

export const LOT_VALUE_RESOLVE:  Partial<{ [key in CustomValueClass | PropertyType]: RegExp }> = {

};