import { Vector2 } from "../../math/vector2";
import { CustomProperty } from "../custom-property";
import { NodeCategory, NodeSubCategory } from "./node-category";
import { IconCategory } from "../icon-category";

export enum NodeState {
    NONE = 0,
    UNUSED = 1 << 0,
    COLLAPSED = 1 << 1,
    OPTIONS = 1 << 2,
    MUTED = 1 << 3,
    SELECTED = 1 << 4,
    LATENT = 1 << 5,
    DEPRECATED = 1 << 6,
    DEFAULT = UNUSED
}

export class Node {
    state: NodeState;
    class: NodeSubCategory;
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
}