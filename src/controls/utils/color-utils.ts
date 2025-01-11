import { NodeCategory } from "../../data/nodes/node-category";
import { PinType } from "../../data/pin/pin-category";
import { PinProperty } from "../../data/pin/pin-property";
import { Node } from "../../data/nodes/node";


enum ResolveCustomCategory {

}

export class ColorUtils {
    public static getPinColor(pin: PinProperty): string {
        return LOT_PIN_COLOR[PinType[pin.type]] ?? LOT_PIN_COLOR[NodeCategory._UNKNOWN];
    }

    public static getNodeColor(node: Node): string {
        return LOT_NODE_COLOR[NodeCategory[node.category]];
    }

    public static resolveNodeColor(node: Node): string {
        const _unknown = LOT_PIN_COLOR[NodeCategory._UNKNOWN];

        for (const key in LOT_NODE_RESOLVE_COLOR) {
            const regex: RegExp = LOT_NODE_RESOLVE_COLOR[key];
            const bMatch = regex && regex.test(node.class);
            
            if (bMatch) {
                //console.log (bMatch, LOT_NODE_COLOR[key], node.class, regex)
                return LOT_NODE_COLOR[key] ?? _unknown;
            }
        }
        return _unknown;
    }
}

export const LOT_PIN_COLOR: Partial<{ [key in PinType]: string }> = {
    [PinType.VALUE]:  "#a1a1a1",
    [PinType.INT]:  "#598c5c",
    [PinType.BOOLEAN]:  "#cca6d6",
    [PinType.VECTOR]:  "#6363c7",
    [PinType.ROTATION]:  "#a663c7",
    [PinType.MATRIX]:  "#b83385",
    [PinType.STRING]:  "#70b2ff",
    [PinType.RGBA]:  "#c7c729",
    [PinType.SHADER]:  "#63c763",
    [PinType.OBJECT]:  "#ed9e5c",
    [PinType.GEOMETRY]:  "#00d6a3",
    [PinType.COLLECTION]:  "#f5f5f5",
    [PinType.TEXTURE]:  "#9e4fa3",
    [PinType.MATERIAL]:  "#eb7582",
    [PinType.MENU]:  "#666666",
    [PinType.IMAGE]:  "#633863",
    [PinType.CUSTOM]:  "#63c763",
    [PinType._UNKNOWN]:  "#515151"
}

export const LOT_NODE_RESOLVE_COLOR_CUSTOM:  { [key in ResolveCustomCategory]: RegExp } = {
   
};

export const LOT_NODE_RESOLVE_COLOR:  { [key in (NodeCategory | ResolveCustomCategory)]: RegExp } = {
    [NodeCategory.CONVERTER_NODE]: /Math|Function/i,
    [NodeCategory.COLOR_NODE]: /RGB|Color|HSV/i,
    [NodeCategory.GROUP_NODE]: /CustromGroup/i,
    [NodeCategory.GROUP_SOCKET_NODE]: /(Simulation|Group|Repeat|Foreach).*(Input|Output)/i,
    [NodeCategory.FRAME_NODE]: /NodeFrame/i,
    [NodeCategory.MATTE_NODE]: /Matte/i,
    [NodeCategory.DISTOR_NODE]: /Distor/i,
    [NodeCategory.INPUT_NODE]: /NodeOutput/i,
    [NodeCategory.OUTPUT_NODE]: /NodeInput/i,
    [NodeCategory.FILTER_NODE]: /CompositorNode/i,
    [NodeCategory.VECTOR_NODE]: /Vector/i,
    [NodeCategory.TEXTURE_NODE]: /TextureNode/i,
    [NodeCategory.SHADER_NODE]: /ShaderNode/i,
    [NodeCategory.SCRIPT_NODE]: /Script/i,
    [NodeCategory.PATTERN_NODE]: /TextureNodeTex/i,
    [NodeCategory.LAYOUT_NODE]: null,
    [NodeCategory.GEOMETRY_NODE]: /GeometryNode/i,
    [NodeCategory.ATTRIBUTE_NODE]: /Attribute|Field/i,
    [NodeCategory.SIMULATION_ZONE]: null,
    [NodeCategory.REPEAT_ZONE]: null,
    [NodeCategory.FOREACH_GEOMETRY_ELEMENT_ZONE]: null,
    [NodeCategory._UNKNOWN]: null,
};

export const LOT_NODE_COLOR:  { [key in NodeCategory]: string } = {
    [NodeCategory.CONVERTER_NODE]: "#12adff80", 
    [NodeCategory.COLOR_NODE]: "#cccc0080", 
    [NodeCategory.GROUP_NODE]: "#3b660a80", 
    [NodeCategory.GROUP_SOCKET_NODE]: "#00000080", 
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