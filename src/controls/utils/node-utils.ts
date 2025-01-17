import { Graph } from "../../data/graph";
import { Node } from "../../data/nodes/node";
import { NodeCategory } from "../../data/nodes/node-enums";
import { NodeControl } from "../nodes/node-control";
import { RerouteNodeControl } from "../nodes/reroute-node-control";

type NodeControlConstrutor = new (...parms: any) => NodeControl

export enum CustomNodeClass {
    NodeReroute,
}

export class NodeUtils {
    public static getNodeControl(key:string): NodeControlConstrutor {
        const _key = CustomNodeClass[key as keyof CustomNodeClass];
        const _class = LOT_NODE_CONTROL[_key] ?? null;
        return _class;
    }

    public static resolveNodeControl(key: string): NodeControlConstrutor {
        const _unknown = null;
        
        for (const _key in LOT_NODE_RESOLVE_CONTROL) {
            const regex: RegExp = LOT_NODE_RESOLVE_CONTROL[_key];
            const bMatch = regex && regex.test(key);
            
            if (bMatch) {
                return LOT_NODE_CONTROL[_key] ?? _unknown;
            }
        }

        return _unknown;
    }

    public static resolveNodeCategory(node: Node): NodeCategory {
        for (const key in LOT_NODE_RESOLVE_CATEGORY) {
            const regex: RegExp = LOT_NODE_RESOLVE_CATEGORY[key];
            const bMatch = regex && regex.test(node.class);
            if (bMatch) { return NodeCategory[key as keyof NodeCategory]; }
        }
        return NodeCategory._UNKNOWN;
    }

}

export const LOT_NODE_CONTROL: { [key in CustomNodeClass]: NodeControlConstrutor } = {
    [CustomNodeClass.NodeReroute]: RerouteNodeControl
}

export const LOT_NODE_RESOLVE_CONTROL:  Partial<{ [key in CustomNodeClass]: RegExp }> = {

}

export const LOT_NODE_RESOLVE_CATEGORY: { [key in NodeCategory]: RegExp; } = {
    [NodeCategory.CONVERTER_NODE]: /Math|Function|ValTo|Switch/i,
    [NodeCategory.COLOR_NODE]: /RGB|Color|HSV|Mix/i,
    [NodeCategory.GROUP_SOCKET_NODE]: /(Gizmo|Warning)|(Simulation|Group|Repeat|Foreach).*(Input|Output)/i,
    [NodeCategory.GROUP_NODE]: /Group/i,
    [NodeCategory.FRAME_NODE]: /NodeFrame/i,
    [NodeCategory.MATTE_NODE]: /Matte/i,
    [NodeCategory.DISTOR_NODE]: /Distor/i,
    [NodeCategory.INPUT_NODE]: /Input|Info/i,
    [NodeCategory.OUTPUT_NODE]: /NodeOutput/i,
    [NodeCategory.FILTER_NODE]: /CompositorNode/i,
    [NodeCategory.VECTOR_NODE]: /Vector/i,
    [NodeCategory.TEXTURE_NODE]: /Texture/i,
    [NodeCategory.SHADER_NODE]: /ShaderNode/i,
    [NodeCategory.SCRIPT_NODE]: /Script/i,
    [NodeCategory.PATTERN_NODE]: /TextureNodeTex/i,
    [NodeCategory.LAYOUT_NODE]: null,
    [NodeCategory.ATTRIBUTE_NODE]: /Attribute/i,
    [NodeCategory.GEOMETRY_NODE]: /GeometryNode/i,
    [NodeCategory.SIMULATION_ZONE]: null,
    [NodeCategory.REPEAT_ZONE]: null,
    [NodeCategory.FOREACH_GEOMETRY_ELEMENT_ZONE]: null,
    [NodeCategory._UNKNOWN]: null,
};
