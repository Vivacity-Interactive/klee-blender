import { HeadedNodeControl } from "../controls/nodes/headed-node-control";
import { NodeControl } from "../controls/nodes/node-control";
import { Node, NodeState } from "../data/nodes/node";
import { PinCategory, PinSubCategory } from "../data/pin/pin-category";
import { PinDirection } from "../data/pin/pin-direction";
import { PinProperty } from "../data/pin/pin-property";
import { decodeHtmlText } from "../utils/text-utils";

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
        node.guid = scope._id; //decodeHtmlText(scope._id)
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
        
        //pin.?? = scope.hide
        //pin.?? = scope.hide_value
        //pin.?? = scope.is_unavailable
        //pin.?? = scope.show_expanded
        //pin.?? = scope.is_multi_input

        pin.subCategory = scope.bl_subtype_label as PinSubCategory
        pin.category = scope.bl_label as PinCategory
        pin.valueType = scope.bl_idname

        if (pin.name == "__extend__") { pin.hideName = true; }

        //pin.?? = scope.display_shape
        //pin.?? = scope.type

        pin.toolTip = scope.description;
    }

    // public populateProperties(parser: UEOFCustomParser, pin: PinProperty, lot: null): void {
        
    // }

    public populate(lot: {} = null): void {
        let _lot = lot
        for (const node of this.scope.nodes) {
            let _node: Node = new Node();
            this.populateObject(node, _node, _lot);
            let _control = new HeadedNodeControl(_node);
            this._controls.push(_control);
        }
    }
}