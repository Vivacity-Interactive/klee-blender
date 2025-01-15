import { PinLink } from "./pin/pin-link"
import { Node } from "../data/nodes/node";

export class Graph {
    nodes: Array<Node> = [];
    links: Array<PinLink> = [];
    _raw: any;
    _enums: {[key: string | number]: { id: string|number, name: string }} = {};
    _options: {[key: string | number]: string } = {}
    _lot: {} = {};
}