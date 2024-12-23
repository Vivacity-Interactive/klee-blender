import { NodeCategory } from "../../data/nodes/node-category";
import { PinCategory } from "../../data/pin/pin-category";
import { PinProperty } from "../../data/pin/pin-property";



export class ColorUtils {
    public static getPinColor(pin: PinProperty): string {
        return "#FFF";
    }
}



export const LOT_NODE_COLOR: Partial<Record<NodeCategory, string>> = {
    [NodeCategory.CONVERTER_NODE]: "#12adff", 
    [NodeCategory.COLOR_NODE]: "#cccc00", 
    [NodeCategory.GROUP_NODE]: "#3b660a", 
    [NodeCategory.GROUP_SOCKET_NODE]: "#000000", 
    [NodeCategory.FRAME_NODE]: "#0f0f0fcc", 
    [NodeCategory.MATTE_NODE]: "#973c3c", 
    [NodeCategory.DISTOR_NODE]: "#4c9797", 
    [NodeCategory.INPUT_NODE]: "#ff3371", 
    [NodeCategory.OUTPUT_NODE]: "#4d0017", 
    [NodeCategory.FILTER_NODE]: "#551a80", 
    [NodeCategory.VECTOR_NODE]: "#4d4dff", 
    [NodeCategory.TEXTURE_NODE]: "#e66800", 
    [NodeCategory.SHADER_NODE]: "#24b524", 
    [NodeCategory.SCRIPT_NODE]: "#084d4d", 
    [NodeCategory.PATTERN_NODE]: "#6c696f", 
    [NodeCategory.LAYOUT_NODE]: "#6c696f", 
    [NodeCategory.GEOMETRY_NODE]: "#00d6a3", 
    [NodeCategory.ATTRIBUTE_NODE]: "#001566", 
    [NodeCategory.SIMULATION_ZONE]: "#66416233", 
    [NodeCategory.REPEAT_ZONE]: "#76512f33", 
    [NodeCategory.FOREACH_GEOMETRY_ELEMENT_ZONE]: "#33527f33", 
};

// export const LOD_PIN_COLOR: Partial<Record<PinCategory, string>> = {
//     [PinCategory.VALUE]: $2,
//     [PinCategory.INT]: $2,
//     [PinCategory.BOOLEAN]: $2,
//     [PinCategory.VECTOR]: $2,
//     [PinCategory.ROTATION]: $2,
//     [PinCategory.MATRIX]: $2,
//     [PinCategory.STRING]: $2,
//     [PinCategory.RGBA]: $2,
//     [PinCategory.SHADER]: $2,
//     [PinCategory.OBJECT]: $2,
//     [PinCategory.GEOMETRY]: $2,
//     [PinCategory.COLLECTION]: $2,
//     [PinCategory.TEXTURE]: $2,
//     [PinCategory.MATERIAL]: $2,
//     [PinCategory.MENU]: $2,
//     [PinCategory.IMAGE]: $2,
//     [PinCategory.VIRTUAL]: $2,
//     [PinCategory.CUSTOM]: $2
// }