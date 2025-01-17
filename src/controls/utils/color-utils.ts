import { NodeCategory } from "../../data/nodes/node-enums";
import { PropertyType } from "../../data/custom-property-enums";
import { PinProperty } from "../../data/pin/pin-property";
import { Node } from "../../data/nodes/node";
import { LOT_NODE_RESOLVE_CATEGORY, NodeUtils } from "./node-utils";


export enum CustomColorCategory {
    NodeSocketVirtual
}

export class ColorUtils {
    public static getPinColor(pin: PinProperty): string {
        return LOT_PIN_COLOR[pin.type] ?? LOT_PIN_COLOR[NodeCategory._UNKNOWN];
    }

    public static getNodeColor(node: Node): string {
        return LOT_NODE_COLOR[NodeCategory[node.category]] ?? LOT_NODE_COLOR[NodeCategory._UNKNOWN];
    }

    public static getCustomColor(key: string): string {
        const _key = CustomColorCategory[key as keyof CustomColorCategory];
        return _key != null ? LOT_COLOR_CUSTOM[_key] : null;
    }

    public static resolveNodeColor(node: Node): string {
        return LOT_NODE_COLOR[NodeUtils.resolveNodeCategory(node)];
    }
}

export const LOT_PIN_COLOR: Partial<{ [key in PropertyType]: string }> = {
    [PropertyType.VALUE]:  "#a1a1a1",
    [PropertyType.INT]:  "#598c5c",
    [PropertyType.BOOLEAN]:  "#cca6d6",
    [PropertyType.VECTOR]:  "#6363c7",
    [PropertyType.ROTATION]:  "#a663c7",
    [PropertyType.MATRIX]:  "#b83385",
    [PropertyType.STRING]:  "#70b2ff",
    [PropertyType.RGBA]:  "#c7c729",
    [PropertyType.SHADER]:  "#63c763",
    [PropertyType.OBJECT]:  "#ed9e5c",
    [PropertyType.GEOMETRY]:  "#00d6a3",
    [PropertyType.COLLECTION]:  "#f5f5f5",
    [PropertyType.TEXTURE]:  "#9e4fa3",
    [PropertyType.MATERIAL]:  "#eb7582",
    [PropertyType.MENU]:  "#666666",
    [PropertyType.IMAGE]:  "#633863",
    [PropertyType.CUSTOM]:  "#63c763",
    [PropertyType._UNKNOWN]:  "#515151"
}

export const LOT_COLOR_CUSTOM:  { [key in CustomColorCategory]: string } = {
   [CustomColorCategory.NodeSocketVirtual]: "#a1a1a1"
};

export const LOT_NODE_COLOR:  { [key in NodeCategory]: string } = {
    [NodeCategory.CONVERTER_NODE]: "#12adff80", 
    [NodeCategory.COLOR_NODE]: "#cccc0080", 
    [NodeCategory.GROUP_SOCKET_NODE]: "#00000080", 
    [NodeCategory.GROUP_NODE]: "#3b660a80", 
    [NodeCategory.FRAME_NODE]: "#0f0f0fcc", 
    [NodeCategory.MATTE_NODE]: "#973c3c80", 
    [NodeCategory.DISTOR_NODE]: "#4c979780", 
    [NodeCategory.INPUT_NODE]: "#ff337180", 
    [NodeCategory.OUTPUT_NODE]: "#4d001780", 
    [NodeCategory.FILTER_NODE]: "#551a8080", 
    [NodeCategory.VECTOR_NODE]: "#4d4dff80", 
    [NodeCategory.TEXTURE_NODE]: "#e6680080", 
    [NodeCategory.SHADER_NODE]: "#24b52480", 
    [NodeCategory.SCRIPT_NODE]: "#084d4d80", 
    [NodeCategory.PATTERN_NODE]: "#6c696f80", 
    [NodeCategory.LAYOUT_NODE]: "#6c696f80", 
    [NodeCategory.GEOMETRY_NODE]: "#00d6a380", 
    [NodeCategory.ATTRIBUTE_NODE]: "#00156680", 
    [NodeCategory.SIMULATION_ZONE]: "#66416233", 
    [NodeCategory.REPEAT_ZONE]: "#76512f33", 
    [NodeCategory.FOREACH_GEOMETRY_ELEMENT_ZONE]: "#33527f33",
    [NodeCategory._UNKNOWN]: "#51515180"
};