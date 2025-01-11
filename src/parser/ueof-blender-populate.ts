import { HeadedNodeControl } from "../controls/nodes/headed-node-control";
import { NodeControl } from "../controls/nodes/node-control";
import { Node, NodeState } from "../data/nodes/node";
import { PinCategory, PinSubCategory, PinType } from "../data/pin/pin-category";
import { PinDirection } from "../data/pin/pin-direction";
import { PinLink, PinLinkState } from "../data/pin/pin-link";
import { PinProperty, PinState } from "../data/pin/pin-property";
import { PinShape } from "../data/pin/pin-shape";

export class BLOEFPopulate {
    protected _scope: any;
    protected _controls: Array<NodeControl> = [];

    public get controls(): Array<NodeControl> { return this._controls; }
    public get scope(): any { return this._scope; }

    constructor (scope: any = {}) {
        this._scope = scope;
    }

    public populateObject(scope: any, node: Node, lot: {}): void {
        node._raw = scope;
        node.id = scope._id;
        node.guid =  //decodeHtmlText(scope._id)
        node.name = scope.name;
        node.title = scope.bl_label;
        node.class = scope.bl_idname;
        node.width = scope.dimensions[0];
        //node.height = scope.dimensions[1];
        node.pos.x = scope.location[0]
        node.pos.y = -scope.location[1]

        if (scope.use_custom_color) { node.backgroundColor = scope.color; }

        if (scope.mute) { node.state |= NodeState.MUTED; }
        if (scope.show_options) { node.state |= NodeState.OPTIONS; }
        if (scope.hide) { node.state |= NodeState.COLLAPSED; }

        for (const pin of scope.inputs) {
            let _pin = new PinProperty(node.name);
            this.populatePin(pin, _pin, lot);
            node.customProperties.push(_pin);
        }

        for (const pin of scope.outputs) {
            let _pin = new PinProperty(node.name);
            this.populatePin(pin, _pin, lot);
            node.customProperties.push(_pin);
        }
        lot[node.id] = node;
        //node.assert()
    }

    public populatePin(scope: any, pin: PinProperty, lot: {}): void {
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

        pin.linkedTo = [];

        lot[pin.id] = pin;
        //pin.assert()
    }

    public populateLink(scope: any, link: PinLink, lot: {}): void {
        let node = lot[scope.to_node];
        if (node) { link.nodeName = node.name; }
        
        link.pinID = scope.to_socket;
        //link.nodeID = scope.to_node;
        link.sortID = scope.multi_input_sort_id;

        if (scope.is_valid) { link.state |= PinLinkState.VALID; }
        if (scope.is_muted) { link.state |= PinLinkState.MUTED; }
        if (scope.is_hidden) { link.state |= PinLinkState.HIDDEN; }

        let pin = lot[scope.from_socket];
        if (pin) { pin.linkedTo.push(link); }
        //link.assert()
    }

    // public populateProperties(parser: UEOFCustomParser, pin: PinProperty, lot: null): void {
        
    // }

    public populate(lot: {} = {}): void {
        let _lot = lot
        for (const node of this.scope.nodes) {
            let _node: Node = new Node();
            this.populateObject(node, _node, _lot);
            let _control = new HeadedNodeControl(_node);
            this._controls.push(_control);
        }

        for (const link of this.scope.links) {
            let _link: PinLink = new PinLink()
            this.populateLink(link, _link, lot);
        }
    }
}