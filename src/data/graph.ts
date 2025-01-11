import { PinLink } from "./pin/pin-link"
import { Node } from "../data/nodes/node";

export class Graph {
    nodes: Array<Node> = [];
    links: Array<PinLink> = [];
    _raw: any;
    _enums: {[key: string]: { id: string|number, name: string }} ={};
    _lot: {} = {};
}