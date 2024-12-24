import { HeadedNodeControl } from "../controls/nodes/headed-node-control";
import { NodeControl } from "../controls/nodes/node-control";
import { PinControl } from "../controls/pin-control";
import { Node } from "../data/nodes/node";
import { NodeSubCategory } from "../data/nodes/node-category";
import { PinCategory } from "../data/pin/pin-category";
import { PinDirection } from "../data/pin/pin-direction";
import { PinProperty } from "../data/pin/pin-property";
import { parseString, parseStringSimple } from "../utils/text-utils";
import { UEOFParser, EUEOFToken, UEOFValueParser, UEOFTupleParser, UEOFCustomParser, UEOFObjectParser, UEOFPropertyParser, UEOFLinkParser } from "./ueof-parser";

function populateLinkedTo(parser: UEOFValueParser, pin: PinProperty, link?: UEOFLinkParser) {
    let _tuple: UEOFTupleParser = null;
    const bValid = parser.raw.token == EUEOFToken.TUPLE 
        && (_tuple = parser.raw as UEOFTupleParser)
        && _tuple.properties.length > 2;

    console.warn(parser.raw.token, EUEOFToken[parser.raw.token]);
    
}

type _UEOFNodeValueLOT = { [ket: string] : (parser: UEOFValueParser, node: Node, link?: UEOFLinkParser) => void };
type _UEOFPinValueLOT = { [ket: string] : (parser: UEOFValueParser, pin: PinProperty, link?: UEOFLinkParser) => void };

export const LOT_UEOF_BLENDER = {
    [EUEOFToken.OBJECT]: {
        "Object": {
            [EUEOFToken.ATTRIBUTE]: {
                "Class": (parser: UEOFValueParser, node: Node) => { node.class = NodeSubCategory[parser.format()]; },
                "Name": (parser: UEOFValueParser, node: Node) => { node.name = parseString(parser.format()); },
            },
            [EUEOFToken.PROPERTY]: {
                "NodeGuid": (parser: UEOFValueParser, node: Node) => { node.guid = parser.format(); },
                "NodeTitle": (parser: UEOFValueParser, node: Node) => { node.title = parseString(parser.format()); },
                // "NodeType": (parser: UEOFValueParser, node: Node) => { },
                // "NodeIcon": (parser: UEOFValueParser, node: Node) => { },
                // "NodeColor": (parser: UEOFValueParser, node: Node) => { node.headerColor = parser.format(); console.log(node.headerColor) },
                "NodeWidth": (parser: UEOFValueParser, node: Node) => { node.width = parseInt(parser.format()); },
                "NodeHeight": (parser: UEOFValueParser, node: Node) => { node.height = parseInt(parser.format()); },
                "NodePosX": (parser: UEOFValueParser, node: Node) => { node.pos.x = parseInt(parser.format()); },
                "NodePosY": (parser: UEOFValueParser, node: Node) => { node.pos.y = parseInt(parser.format()); },
            },
            [EUEOFToken.CUSTOM]: {
                "Pin": {
                    "PinId": (parser: UEOFValueParser, pin: PinProperty) => { pin.id = parser.format(); },
                    "PinName": (parser: UEOFValueParser, pin: PinProperty) => { pin.name = parser.format(); },
                    "Direction": (parser: UEOFValueParser, pin: PinProperty) => { pin.direction = PinDirection[parser.format()]; },
                    // "PinColor": (parser: UEOFValueParser, pin: PinProperty) => {},
                    // "PinCategory": (parser: UEOFValueParser, pin: PinProperty) => {},
                    // "PinSubCategory": (parser: UEOFValueParser, pin: PinProperty) => {},
                    // "PinCategoryObject": (parser: UEOFValueParser, pin: PinProperty) => {},
                    // "PinSubCategoryObject": (parser: UEOFValueParser, pin: PinProperty) => {},
                    // "bHidden": (parser: UEOFValueParser, pin: PinProperty) => {},
                    // "DefaultValue": (parser: UEOFValueParser, pin: PinProperty) => {},
                    // "bNotConnectable": (parser: UEOFValueParser, pin: PinProperty) => {},
                    // "bForceNoneField": (parser: UEOFValueParser, pin: PinProperty) => {},
                    // "bLayerSelection": (parser: UEOFValueParser, pin: PinProperty) => {},
                    // "bHideInModifier": (parser: UEOFValueParser, pin: PinProperty) => {},
                    "LinkedTo": populateLinkedTo,
                }
            }
        }
    }
}

export class UEOFBlenderPopulate {
    protected _parser: UEOFParser;
    protected _controls: Array<NodeControl> = [];

    public get controls(): Array<NodeControl> { return this._controls; }
    public get parser(): UEOFParser { return this._parser; }

    constructor (parser: UEOFParser) {
        this._parser = parser;
    }

    public populateObject(parser: UEOFObjectParser, node: Node, lot: {}): void {
        const _lot_attr:_UEOFNodeValueLOT = lot[EUEOFToken.ATTRIBUTE]
        for (const item of parser.attributes) {
            _lot_attr[item.name.format()]?.(item.value, node);
        }

        const _lot_prop:_UEOFNodeValueLOT = lot[EUEOFToken.PROPERTY]
        for (const item of parser.properties) {
            _lot_prop[item.attribute.name.format()]?.(item.attribute.value, node, item.link);
        }

        // const _lot_cust = lot[EUEOFToken.CUSTOM]
        // for (const item of parser.customs) {
        //     const _lot_pin = _lot_cust[item.name.format()];
        //     let _pin: PinProperty = new PinProperty(node.name);
        //     this.populatePin(item, _pin, _lot_pin);
        //     node.customProperties.push(_pin);
        // }
    }

    public populatePin(parser: UEOFCustomParser, pin: PinProperty, lot: _UEOFPinValueLOT): void {
        
    }

    public populate(lot: {} = LOT_UEOF_BLENDER): void {
        const _lot_obj = lot[EUEOFToken.OBJECT];
        for (const item of this.parser.objects) {
            const _lot = _lot_obj[item.name.format()];
            let _node: Node = new Node();
            this.populateObject(item, _node, _lot);
            let _control = new HeadedNodeControl(_node);
            this._controls.push(_control);
        }
    }
}