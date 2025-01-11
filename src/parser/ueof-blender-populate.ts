import { Graph } from "../data/graph";
import { Node, NodeState } from "../data/nodes/node";
import { PinCategory, PinSubCategory, PinType } from "../data/pin/pin-category";
import { PinDirection } from "../data/pin/pin-direction";
import { PinLink, PinLinkState } from "../data/pin/pin-link";
import { PinProperty, PinState } from "../data/pin/pin-property";
import { PinShape } from "../data/pin/pin-shape";

export class BLOEFPopulate {
    protected _graph: Graph;

    public get graph(): any { return this._graph; }
    public get scope(): any { return this._graph._raw; }
    public get nodes(): Array<Node> { return this._graph.nodes; }
    public get links(): Array<PinLink> { return this._graph.links; }
    public get lot(): {} { return this._graph._lot; }
    public get enums(): {} { return this._graph._enums; }

    constructor (scope: any = {}, graph: Graph = null, lot: any = {}) {
        this._graph = graph ?? new Graph();
        this._graph._lot = lot;
        this._graph._raw = scope;
        this._graph._enums = scope._enums;
    }

    public populateObject(scope: any, node: Node): void {
        node._raw = scope;
        node.id = scope._id;
        node.guid =  //decodeHtmlText(scope._id)
        node.name = scope.name;
        node.title = scope.bl_label;
        node.label = scope.bl_label;
        node.class = scope.bl_idname;
        node.width = scope.dimensions[0];
        //node.height = scope.dimensions[1];
        node.pos.x = scope.location[0]
        node.pos.y = -scope.location[1]

        if (scope.use_custom_color) { node.backgroundColor = scope.color; }

        if (scope.mute) { node.state |= NodeState.MUTED; }
        if (scope.show_options) { node.state |= NodeState.OPTIONS; }
        if (scope.hide) { node.state |= NodeState.COLLAPSED; }

        if (scope.operation) { node.title = this.enums['operation'][scope.operation]; }

        for (const pin of scope.inputs) {
            let _pin = new PinProperty(node.name);
            this.populatePin(pin, _pin);
            node.customProperties.push(_pin);
        }

        for (const pin of scope.outputs) {
            let _pin = new PinProperty(node.name);
            this.populatePin(pin, _pin);
            node.customProperties.push(_pin);
        }
        //this.lot[node.id] = node;
        //node.assert()
    }

    public populatePin(scope: any, pin: PinProperty): void {
        pin.id = scope._id; //decodeHtmlText(scope._id)
        pin.name = scope.identifier
        pin.friendlyName = scope.name
        
        pin.direction = +scope.is_output as PinDirection;
        pin.hidden = scope.hide || scope.is_unavailable;
        pin.enabled = scope.enabled;
        pin.defaultValue = scope.default_value;

        pin.subCategory = scope.bl_subtype_label as PinSubCategory;
        pin.category = scope.bl_label as PinCategory;
        pin.valueType = scope.bl_idname;
        
        pin.shape = scope.display_shape as PinShape;
        pin.type = scope.type as PinType;
        pin.toolTip = scope.description;
        
        if (scope.enable) { pin.state |= PinState.ENABLED; pin.enabled = true; }
        if (scope.hide) { pin.state |= PinState.HIDDEN; pin.hidden = true }
        if (scope.hide_value) { pin.state |= PinState.VALUELESS; }
        if (scope.is_unavailable) { pin.state |= PinState.UNAVAILABLE; }
        if (scope.show_expanded) { pin.state |= PinState.OPTIONS; }
        if (scope.is_multi_input) { pin.state |= PinState.MULTI; }
        if (scope.pin_gizmo) { pin.state |= PinState.GIZOM; }
        if (pin.name == "__extend__") { pin.state |= PinState.NAMELESS; pin.hideName = true; }
        //this.lot[pin.id] = pin;
        //pin.assert()
    }

    public populateLink(scope: any, link: PinLink): void {        
        link.toPinID = scope.to_socket;
        link.toNodeID = scope.to_node;
        link.fromPinID = scope.from_socket;
        link.fromNodeID = scope.from_node;
        link.sortID = scope.multi_input_sort_id;

        if (scope.is_valid) { link.state |= PinLinkState.VALID; }
        if (scope.is_muted) { link.state |= PinLinkState.MUTED; }
        if (scope.is_hidden) { link.state |= PinLinkState.HIDDEN; }
        //link.assert()
    }

    public populate(): void {
        for (const node of this.scope.nodes) {
            let _node: Node = new Node();
            this.populateObject(node, _node);
            this.nodes.push(_node);
        }

        for (const link of this.scope.links) {
            let _link: PinLink = new PinLink()
            this.populateLink(link, _link);
            this.links.push(_link);
        }
    }
}