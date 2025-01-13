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
    
}

export const LOT_NODE_CONTROL: { [key in CustomNodeClass]: NodeControlConstrutor } = {
    [CustomNodeClass.NodeReroute]: RerouteNodeControl
}

export const LOT_NODE_RESOLVE_CONTROL:  Partial<{ [key in CustomNodeClass]: RegExp }> = {

};