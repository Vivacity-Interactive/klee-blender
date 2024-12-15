import { NodeParser } from "node.parser";
import { NodeControl } from "../controls/nodes/node.control";
//import { ParsingNodecursor } from "parsing-node-cursor";
import { _ParseCursor, Parser } from "../utils/parse-utils";
import { token, tokenAny, tokenChar, tokenCharOnce, tokenNotRanges, tokenRange, tokenRangeOnce, tokenRanges, tokenString } from "../utils/token-utils";

export enum EValueParser {
    NONE = 0,
    STRING = 1 << 0,
    VALUE = 1 << 1,
    TUPLE = 1 << 2,
    NAME = 1 << 3,
    //LINK = 1 << 4,
    NAMED_STRING = NAME | STRING,
    NAMED_TUPLE = NAME | TUPLE,
    NAMED_VALUE = NAME | VALUE, // should never happen
    //NAMED_LINK = NAME | LINK, // should never happen
}

export class UEOFObjectParser extends Parser {
    public static readonly FM_BEGIN = "Begin Object";
    public static readonly FM_END = "End Object";
    public static readonly FM_PROPERTY = "\n\t";
    public static readonly FM_ATTRIBUTE = " ";
    public static readonly FM_OBJECT = "\n";

    public attributes: Array<UEOFPropertyParser> = []
    public properties: Array<UEOFPropertyParser> = []
    public customs: Array<UEOFCustomParser> = []

    public parse(cursor: _ParseCursor): boolean {
        let bValid: boolean = false;
        let bLine: boolean = false;
        let bNext: boolean = true;
        let bAttribute: boolean = false;
        let bProperty: boolean = false;
        let bCustom: boolean = false;

        this._cursor = cursor.snapshot();
        this._cursor.start(cursor);
        
        bValid = token(cursor, UEOFObjectParser.FM_BEGIN);
        if (bValid) {
            bNext = tokenAny(cursor, UEOFParser.FM_SPACE);
            while (bNext) {
                let attribute = new UEOFPropertyParser();
                bAttribute = attribute.parse(cursor);
                if (bAttribute) { this.attributes.push(attribute); }
                bNext = tokenAny(cursor, UEOFParser.FM_SPACE);
            }
            
            bNext = tokenRange(cursor, UEOFParser.FM_LINE);
            while (bNext) {
                let custom = new UEOFCustomParser();
                bLine = bNext;
                tokenAny(cursor, UEOFParser.FM_SPACE);
                bCustom = custom.parse(cursor);
                if (bCustom) { this.customs.push(custom); }
                else {
                    let property = new UEOFPropertyParser();
                    bProperty = property.parse(cursor);
                    if (bProperty) { this.properties.push(property); }
                }
                bNext = tokenRange(cursor, UEOFParser.FM_LINE);
            }

            bValid = true
                && (bLine || tokenRange(cursor, UEOFParser.FM_LINE)) 
                && token(cursor, UEOFObjectParser.FM_END);
        }

        this._cursor.end(cursor, bValid);
        return bValid;
    }

    public format(): string {
        let _format: string = UEOFObjectParser.FM_BEGIN;
        
        for (const item of this.attributes) {
            _format += UEOFObjectParser.FM_ATTRIBUTE + item.format();
        }

        for (const item of this.properties) {
            _format += UEOFObjectParser.FM_PROPERTY + item.format();
        }

        for (const item of this.customs) {
            _format += UEOFObjectParser.FM_PROPERTY + item.format();
        }

        _format += UEOFObjectParser.FM_OBJECT + UEOFObjectParser.FM_END;
        return _format;
    }
}

export class UEOFPropertyParser extends Parser {
    public static readonly FM_SET = "=";

    public name: UEOFValueParser = new UEOFValueParser();
    public value: UEOFValueParser = new UEOFValueParser();

    public parse(cursor: _ParseCursor): boolean {
        let bValid: boolean = false;

        this._cursor = cursor.snapshot();
        this._cursor.start(cursor);

        bValid = true
            && this.name.parse(cursor)
            && tokenCharOnce(cursor, UEOFPropertyParser.FM_SET)
            && this.value.parse(cursor);

        this._cursor.end(cursor, bValid);
        if (!bValid) { cursor.recover(this._cursor); }
        return bValid;
    }

    public format(): string {
        return this.name.format() + UEOFPropertyParser.FM_SET + this.value.format();
    }
}

export class UEOFNameParser extends Parser  {
    public parse(cursor: _ParseCursor): boolean { 
        let bValid: boolean = false;
        
        this._cursor = cursor.snapshot();
        this._cursor.start(cursor);

        bValid = true
            && !tokenRangeOnce(cursor, UEOFParser.FM_DIGIT, false)
            && tokenRanges(cursor, UEOFParser.FM_VAR);

        this._cursor.end(cursor, bValid);
        return bValid;
    }

    public format(): string {
        return this._cursor.result();
    }
}

export class UEOFStringParser extends Parser  {
    public parse(cursor: _ParseCursor): boolean { 
        let bValid: boolean = false;
        
        this._cursor = cursor.snapshot();
        this._cursor.start(cursor);

        bValid = tokenString(cursor);

        this._cursor.end(cursor, bValid);
        return bValid;
    }

    public format(): string {
        // TODO needs fix due to literals still included in value
        return this._cursor.result();
    }
}

export class UEOFRawParser extends Parser  {
    public parse(cursor: _ParseCursor): boolean { 
        let bValid: boolean = false;
        
        this._cursor = cursor.snapshot();
        this._cursor.start(cursor);

        bValid = tokenNotRanges(cursor, UEOFParser.FM_DELIM);;

        this._cursor.end(cursor, bValid);
        return bValid;
    }

    public format(): string {
        return this._cursor.result();
    }
}

export class UEOFTupleParser extends Parser  {
    public static readonly FM_BEGIN = "(";
    public static readonly FM_END = ")";
    public static readonly FM_PROPERTY = ",";

    public properties: Array<UEOFPropertyParser|UEOFLinkParser> = [];

    public parse(cursor: _ParseCursor): boolean {
        let bValid: boolean = false;
        let bNext: boolean = true;
        let bProperty: boolean = false;
        let bLink: boolean = false;
        
        this._cursor = cursor.snapshot();
        this._cursor.start(cursor);

        bValid = tokenCharOnce(cursor, UEOFTupleParser.FM_BEGIN);
        if (bValid) {
            while (bNext) {
                let property = new UEOFPropertyParser();
                tokenAny(cursor, UEOFParser.FM_SPACE);
                bProperty = property.parse(cursor);
                if (bProperty) { this.properties.push(property); }
                else {
                    let link = new UEOFLinkParser();
                    bLink = link.parse(cursor);
                    if (bLink) { this.properties.push(link); }
                }
                tokenAny(cursor, UEOFParser.FM_SPACE);
                bNext = tokenChar(cursor, UEOFTupleParser.FM_PROPERTY);
            }
        }
        bValid &&= tokenCharOnce(cursor, UEOFTupleParser.FM_END);

        this._cursor.end(cursor, bValid);
        if (!bValid) { cursor.recover(this._cursor); }
        return bValid;
    }

    public format(): string {
        let _format: string = UEOFTupleParser.FM_BEGIN;
        let bFirst = true;
        for (const item of this.properties) {
            _format += (bFirst ? "" : UEOFTupleParser.FM_PROPERTY) + item.format();
            bFirst = false;
        }
        _format += UEOFTupleParser.FM_END;
        return _format;
    }
}

export class UEOFLinkParser extends Parser  {
    public static readonly FM_PIPE = " ";

    public relations: Array<UEOFValueParser> = [];

    public parse(cursor: _ParseCursor): boolean {
        let bValid: boolean = false;
        let bNext: boolean = true;
        let bRelation: boolean = false;
        
        this._cursor = cursor.snapshot();
        this._cursor.start(cursor);

        while (bNext) {
            let value = new UEOFValueParser();
            bRelation = value.parse(cursor);
            if (bRelation) { this.relations.push(value); }
            bNext = tokenChar(cursor, UEOFLinkParser.FM_PIPE);
        }
        bValid = this.relations.length > 0;

        this._cursor.end(cursor, bValid);
        return bValid;
    }

    public format(): string {
        let _format: string = "";
        let bFirst = true;
        for (const item of this.relations) {
            _format += (bFirst ? "" : UEOFLinkParser.FM_PIPE) + item.format();
            bFirst = false;
        }
        return _format;
    }
}

export class UEOFValueParser extends Parser  {
    public flag: EValueParser = EValueParser.NONE;
    public named: UEOFNameParser = new UEOFNameParser();
    public raw: Parser = null;

    protected option(flag: EValueParser, raw: Parser = null, nameless: boolean = false) : boolean {
        this.flag |= flag;
        this.raw = raw;
        if (nameless) { this.named.cursor.rollback(); }
        return true;
    }

    protected recover(cursor: _ParseCursor): _ParseCursor {
        cursor.recover(this.named.cursor);
        return cursor;
    }

    public parse(cursor: _ParseCursor): boolean {
        let bValid: boolean = false;
        let _bValid: boolean = false;

        let _tuple = new UEOFTupleParser();
        let _string = new UEOFStringParser();
        let _raw = new UEOFRawParser();
        //let _link = new UEOFLinkParser();
        
        this._cursor = cursor.snapshot();
        this._cursor.start(cursor);

        bValid = this.named.parse(cursor) && this.option(EValueParser.NAME);

        _bValid = false
            || (_string.parse(cursor) && this.option(EValueParser.STRING, _string))
            || (_tuple.parse(cursor) && this.option(EValueParser.TUPLE, _tuple))
            //|| (_link.parse(this.recover(cursor)) && this.option(EValueParser.LINK, _link, true))
            || (_raw.parse(this.recover(cursor)) && this.option(EValueParser.VALUE, _raw, true));
        
        bValid ||= _bValid;

        this._cursor.end(cursor, bValid);
        if (!bValid) { cursor.recover(this._cursor); }
        return bValid;
    }

    public format(): string {
        return this.named.format() + (this.raw ? this.raw.format() : "");
    }
}

export class UEOFCustomParser extends Parser  {
    public static readonly FM_CUSTOM = "CustomProperties";
    public static readonly FM_SPACER = " ";

    public name: UEOFNameParser = new UEOFNameParser();
    public properties: UEOFTupleParser = new UEOFTupleParser();

    public parse(cursor: _ParseCursor): boolean {
        let bValid: boolean = false;
        
        this._cursor = cursor.snapshot();
        this._cursor.start(cursor);

        bValid = true
            && token(cursor, UEOFCustomParser.FM_CUSTOM)
            && tokenAny(cursor, UEOFParser.FM_SPACE)
            && this.name.parse(cursor)
            && tokenAny(cursor, UEOFParser.FM_SPACE)
            && this.properties.parse(cursor);

        this._cursor.end(cursor, bValid);
        if (!bValid) { cursor.recover(this._cursor); }
        return bValid;
    }

    public format(): string {
        return UEOFCustomParser.FM_CUSTOM 
            + UEOFCustomParser.FM_SPACER + this.name.format() + UEOFCustomParser.FM_SPACER
            + this.properties.format();
    }
}

export class UEOFParser extends Parser  {
    public static readonly DEFAULT_NO_ID = "00000000000"
    //public static readonly FM_VAR = "azAZ09//\\\\::-.__@@";
    public static readonly FM_VAR = "azAZ09//\\\\::-.__";
    public static readonly FM_DIGIT = "09";
    public static readonly FM_CLEAR = "\x01\x20";
    public static readonly FM_SPACE = " \t";
    public static readonly FM_LINE = "\x0a\x0d";
    public static readonly FM_DELIM = "\x00\x20\x22\x22\x27\x29\x2c\x2c\x3b\x3e\x5b\x5b\x5d\x5d\x60\x60\x7b\x7d\x7f\x7f";

    public objects: Array<UEOFObjectParser> = [];
    
    public parse(cursor: _ParseCursor): boolean {
        let bValid: boolean = false;
        let bNext: boolean = true;

        this._cursor = cursor.snapshot();
        this._cursor.start(cursor);

        tokenRange(cursor, UEOFParser.FM_CLEAR);

        while (bNext) {
            let object = new UEOFObjectParser();
            bValid = object.parse(cursor);
            if (bValid) { this.objects.push(object); }
            bNext = tokenRange(cursor, UEOFParser.FM_LINE);
        }

        this._cursor.end(cursor, bValid);
        return bValid;
    }

    public format(): string {
        let _format: string = "";

        let bFirst = true;
        for (const item of this.objects) {
            _format += (bFirst ? "" : UEOFObjectParser.FM_OBJECT) + item.format();
            bFirst = false;
        }
        return _format;
    }
}