import { Graph } from "../data/graph";
import { Node } from "../data/nodes/node";
import { NodeState } from "../data/nodes/node-enums";
import { PinCategory, PinSubCategory, PinType } from "../data/pin/pin-enums";
import { PinDirection } from "../data/pin/pin-enums";
import { PinLink } from "../data/pin/pin-link";
import { PinLinkState } from "../data/pin/pin-link-enums";
import { PinProperty } from "../data/pin/pin-property";
import { PinState } from "../data/pin/pin-enums";
import { PinShape } from "../data/pin/pin-enums";
import { LOT_VALUE } from "../utils/value-utils";

export class BLOEFPopulate {
    protected _graph: Graph;

    public get graph(): any { return this._graph; }
    public get scope(): any { return this._graph._raw; }
    public get nodes(): Array<Node> { return this._graph.nodes; }
    public get links(): Array<PinLink> { return this._graph.links; }
    public get lot(): {} { return this._graph._lot; }
    public get enums(): {} { return this._graph._enums; }
    public get options(): {} { return this._graph._options; }

    constructor (scope: any = {}, graph: Graph = null, lot: any = {}) {
        this._graph = graph ?? new Graph();
        this._graph._lot = lot;
        this._graph._raw = scope;
        this._graph._enums = scope._enums;
        this._graph._options = scope._options;
    }

    public populateObject(scope: any, node: Node): void {
        node._raw = scope;
        node.id = scope._id;
        node.cid = scope.rna_type;
        node.name = scope.name;
        node.title = scope.bl_label;
        node.label = scope.bl_label;
        node.class = scope.bl_idname;
        node.width = scope.dimensions[0];
        //node.height = scope.dimensions[1];
        node.pos.x = scope.location[0]
        node.pos.y = -scope.location[1]

        const bLabel = !scope.label && scope.label.length !== 0;
        if (bLabel) { node.title = scope.label; }

        if (scope.use_custom_color) { node.backgroundColor = scope.color; }
        if (scope.mute) { node.state |= NodeState.MUTED; }
        if (scope.show_options) { node.state |= NodeState.OPTIONS; }
        if (scope.hide) { node.state |= NodeState.COLLAPSED; }

        //if (scope.operation) { node.title = this.enums['operation'][scope.operation]; }
        const bOperator = !bLabel && scope.operation;
        if (bOperator) { node.title = this.enums[scope.operation[1]][scope.operation[0]]; }

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
        pin.friendlyName = scope.name;
        
        const bLabel = !scope.label && scope.label.length !== 0;
        if (bLabel) { pin.friendlyName = scope.label; }
        
        pin.direction = +scope.is_output as PinDirection;
        pin.hidden = scope.hide || scope.is_unavailable;
        pin.enabled = scope.enabled;
        
        pin.subCategory = PinSubCategory[scope.bl_subtype_label as keyof PinSubCategory];
        pin.category = PinCategory[scope.bl_label as keyof PinCategory];
        pin.valueType = scope.bl_idname;
        
        //pin.shape = PinShape[scope.display_shape[0] as keyof PinShape];
        //pin.type = PinType[scope.type[0] as keyof PinType];
        pin.shape = PinShape[scope.display_shape[0] as keyof PinShape];
        pin.type = PinType[scope.type[0] as keyof PinType];
        pin.toolTip = scope.description;
        
        pin.defaultValue = LOT_VALUE[pin.type](scope.default_value);
        
        if (scope.enable) { pin.state |= PinState.ENABLED; pin.enabled = true; }
        if (scope.hide) { pin.state |= PinState.HIDDEN; pin.hidden = true }
        if (scope.hide_value) { pin.state |= PinState.VALUELESS; }
        if (scope.is_unavailable) { pin.state |= PinState.UNAVAILABLE; }
        if (scope.is_linked) { pin.state |= PinState.LINKED; }
        if (scope.show_expanded) { pin.state |= PinState.OPTIONS; }
        if (scope.is_multi_input) { pin.state |= PinState.MULTI; }
        if (scope.pin_gizmo) { pin.state |= PinState.GIZOM; }
        
        if (pin.valueType == "NodeSocketVirtual") { 
            pin.state |= PinState.NAMELESS; pin.hideName = true;
            pin.shape = PinShape.CIRCLE_DOT;
        }
        //this.lot[pin.id] = pin;
        //pin.assert()
    }

    public populateLink(scope: any, link: PinLink): void {
        link._raw = scope;    
        link.id = scope._id;
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