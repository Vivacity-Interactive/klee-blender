import { Vector2 } from "../../math/vector2";
import { CustomProperty } from "../custom-property";
import { NodeCategory, NodeState } from "./node-enums";
import { IconCategory } from "../icon-category";

export class Node {
    _raw: any;
    id: string|number;
    cid: string|number;
    state: NodeState;
    class: string;
    label: string;
    category: NodeCategory;
    icon: IconCategory;
    name: string;
    title: string;
    guid: string;
    pos: Vector2 = new Vector2(0, 0);
    height: number;
    width: number;
    customProperties: CustomProperty[] = [];
    headerColor?: string;
    backgroundColor?: string;

    errorType?: number;
    errorMsg?: string;

    public get isSelected(): boolean { 
        return (this.state & NodeState.SELECTED) == NodeState.SELECTED;
    }
}