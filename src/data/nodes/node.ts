import { Vector2 } from "../../math/vector2";
import { CustomProperty } from "../custom-property";
import { NodeCategory } from "./node-category";
import { IconCategory } from "../icon-category";

export enum NodeState {
    NONE = 0,
    MUTED = 1 << 0,
    HIDDEN = 1 << 1,
    ENABLED = 1 << 2,
    OPTIONS = 1 << 3,
    ADVANCED = 1 << 4,
    LATENT = 1 << 5,
    DEPRECATED = 1 << 6,
    SELECTED = 1 << 7,
    COLLAPSED = 1 << 8,
    DEFAULT = ENABLED
}

export class Node {
    _raw: any;
    id: string;
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
}