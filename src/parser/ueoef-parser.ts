import { NodeParser } from "node.parser";
import { NodeControl } from "../controls/nodes/node.control";
import { ParsingNodeData } from "parsing-node-data";
import { _ParseCursor } from "../utils/parse-utils";

export class UEOEFObjectParser extends NodeParser {
    public static readonly FM_BEGIN = "Begin Object";
    public static readonly FM_END = "End Object";
    public static readonly FM_PROPERTY = ",";
    public static readonly FM_ATTRIBUTE = " ";

    protected _cursor: _ParseCursor;

    public attributes: Array<UEOEFPropertyParser>
    public properties: Array<UEOEFPropertyParser>
    public pins: Array<UEOEFPinParser>

    public parse(data: ParsingNodeData): NodeControl {

        return null;
    }
}

export class UEOEFPropertyParser extends NodeParser {
    public static readonly FM_SET = "=";

    protected _cursor: _ParseCursor;

    public flag: number
    public name: string
    public value: any

    public parse(data: ParsingNodeData): NodeControl {

        return null;
    }
}

export class UEOEFTupleParser extends NodeParser {
    public static readonly FM_BEGIN = "(";
    public static readonly FM_END = ")";
    public static readonly FM_PROPERTY = ",";

    protected _cursor: _ParseCursor;

    public properties: Array<UEOEFPropertyParser>

    public parse(data: ParsingNodeData): NodeControl {

        return null;
    }
}

export class UEOEFPinParser extends NodeParser {
    public static readonly FM_BEGIN = "CustomProperties Pin (";
    public static readonly FM_END = ")";
    public static readonly FM_PROPERTY = ",";

    protected _cursor: _ParseCursor;

    public parse(data: ParsingNodeData): NodeControl {

        return null;
    }
}


export class UEOEFLinkParser extends NodeParser {
    public static readonly FM_PIPE = " ";

    protected _cursor: _ParseCursor;

    public node: string
    public pin: string

    public parse(data: ParsingNodeData): NodeControl {

        return null;
    }
}

export class UEOEFParser extends NodeParser {
    public static readonly DEFAULT_NO_ID = "00000000000"

    protected _cursor: _ParseCursor;

    public objects: Array<UEOEFObjectParser>
    
    public parse(data: ParsingNodeData): NodeControl {

        return null;
    }
}