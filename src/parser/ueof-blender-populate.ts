import { Graph } from "../data/graph";
import { Node } from "../data/nodes/node";
import { NodeState } from "../data/nodes/node-enums";
import { PropertyType } from "../data/custom-property-enums";
import { PropertySubCategory } from "../data/custom-property-enums";
import { PinDirection } from "../data/pin/pin-enums";
import { PinLink } from "../data/pin/pin-link";
import { PinLinkState } from "../data/pin/pin-link-enums";
import { PinProperty } from "../data/pin/pin-property";
import { PropertyState } from "../data/custom-property-enums";
import { PinShape } from "../data/pin/pin-enums";
import { LOT_VALUE } from "../utils/value-utils";
import { OptionProperty } from "../data/option/option-property";
import { NodeUtils } from "../controls/utils/node-utils";

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
        node.height = scope.dimensions[1];
        node.pos.x = scope.location[0]
        node.pos.y = -scope.location[1]

        const bLabel = !scope.label && scope.label.length !== 0;
        if (bLabel) { node.title = scope.label; }

        if (scope.use_custom_color) { node.backgroundColor = scope.color; }
        if (scope.mute) { node.state |= NodeState.MUTED; }
        if (scope.show_options) { node.state |= NodeState.OPTIONS; }
        if (scope.hide) { node.state |= NodeState.COLLAPSED; }

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

        const options = this.options[node.cid];
        if (options) {
            for (let index = options.length - 1; index >= 0 ; index--) {
                const option = options[index];
                let _option = new OptionProperty(node.name);
                this.populateOption(option, _option, scope[option.identifier]);
                node.customProperties.push(_option);
            }
        }

        node.category = NodeUtils.resolveNodeCategory(node);
        //this.lot[node.id] = node;
        //node.assert()
    }

    public populatePin(scope: any, pin: PinProperty): void {
        pin.id = scope._id;
        pin.name = scope.identifier
        pin.friendlyName = scope.name;
        
        const bLabel = !scope.label && scope.label.length !== 0;
        if (bLabel) { pin.friendlyName = scope.label; }
        
        pin.direction = +scope.is_output as PinDirection;
        pin.shape = PinShape[scope.display_shape[0] as keyof PinShape];
        pin.valueType = scope.bl_idname;
        
        pin.subCategory = PropertySubCategory[scope.bl_subtype_label as keyof PropertySubCategory];
        pin.type = PropertyType[scope.type[0] as keyof PropertyType];
        pin.toolTip = scope.description;
        
        pin.defaultValue = LOT_VALUE[pin.type](scope.default_value, this.graph);
        
        if (scope.enable) { pin.state |= PropertyState.ENABLED; }
        if (scope.hide) { pin.state |= PropertyState.HIDDEN; }
        if (scope.hide_value) { pin.state |= PropertyState.VALUELESS; }
        if (scope.is_unavailable) { pin.state |= PropertyState.UNAVAILABLE; }
        if (scope.is_linked) { pin.state |= PropertyState.LINKED; }
        if (scope.show_expanded) { pin.state |= PropertyState.OPTIONS; }
        if (scope.is_multi_input) { pin.state |= PropertyState.MULTI; }
        if (scope.pin_gizmo) { pin.state |= PropertyState.GIZOM; }
        if (scope.is_animatable) { pin.state |= PropertyState.ANIMATABLE; }
        
        if (pin.valueType == "NodeSocketVirtual") { 
            pin.state |= PropertyState.NAMELESS;
            pin.shape = PinShape.CIRCLE_DOT;
        }
        //this.lot[pin.id] = pin;
        //pin.assert()
    }

    public populateOption(scope: any, option: OptionProperty, value: any) {
        option.id = scope._id; //decodeHtmlText(scope._id)
        option.name = scope.identifier
        option.friendlyName = scope.name;

        option.subCategory = PropertySubCategory[scope.bl_subtype_label as keyof PropertySubCategory];
        option.type = PropertyType[scope.type[0] as keyof PropertyType];
        option.toolTip = scope.description;
        option.defaultValue = LOT_VALUE[option.type](value, this.graph);

        if (scope.is_hidden) { option.state |= PropertyState.HIDDEN; }
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