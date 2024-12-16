import { _ParseCursor, Parser } from "../utils/parse-utils";
import { token, tokenAny, tokenChar, tokenCharOnce, tokenNotRanges, tokenRange, tokenRangeOnce, tokenRanges, tokenString } from "../utils/token-utils";

export enum EValueParser {
    NONE = 0,
    STRING = 1 << 0,
    VALUE = 1 << 1,
    TUPLE = 1 << 2,
    NAME = 1 << 3,
    CONCAT = 1 << 4,
    NAMED_STRING = NAME | STRING,
    NAMED_TUPLE = NAME | TUPLE,
    VALUED_STRING = VALUE | STRING,
    VALUED_TUPLE = VALUE | TUPLE,
}

export class UEOFObjectParser extends Parser {
    public name: UEOFNameParser = new UEOFNameParser;
    public attributes: Array<UEOFAttributeParser> = []
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
        
        bValid = true 
            && token(cursor, UEOFParser.FM_OBJECT_BEGIN)
            && tokenAny(cursor, UEOFParser.T_SPACE)
            && this.name.parse(cursor);

        if (bValid) {
            bNext = tokenAny(cursor, UEOFParser.T_SPACE);
            while (bNext) {
                let attribute = new UEOFAttributeParser();
                bAttribute = attribute.parse(cursor);
                if (bAttribute) { this.attributes.push(attribute); }
                bNext = tokenAny(cursor, UEOFParser.T_SPACE);
            }
            
            bNext = tokenRange(cursor, UEOFParser.T_LINE);
            while (bNext) {
                let custom = new UEOFCustomParser();
                bLine = bNext;
                tokenAny(cursor, UEOFParser.T_SPACE);
                bNext = !token(cursor, UEOFParser.FM_OBJECT_END, false);
                if (bNext) {
                    bCustom = custom.parse(cursor);
                    if (bCustom) { this.customs.push(custom); }
                    else {
                        let property = new UEOFPropertyParser();
                        bProperty = property.parse(cursor);
                        if (bProperty) { this.properties.push(property); }
                    }
                    bNext = tokenRange(cursor, UEOFParser.T_LINE);
                }
            }

            bValid = true
                && (bLine || tokenRange(cursor, UEOFParser.T_LINE))
                && (tokenAny(cursor, UEOFParser.T_SPACE) || true)
                && token(cursor, UEOFParser.FM_OBJECT_END)
                && (tokenAny(cursor, UEOFParser.T_SPACE) || true)
                && token(cursor, this.name.format());
        }

        this._cursor.end(cursor, bValid);
        return bValid;
    }

    public format(): string {
        let _name = UEOFParser.FM_SPACE + this.name.format();
        let _format: string = UEOFParser.FM_OBJECT_BEGIN + _name;
        
        for (const item of this.attributes) {
            _format += UEOFParser.FM_SPACE + item.format();
        }

        for (const item of this.properties) {
            _format += UEOFParser.FM_PROPERTY + item.format();
        }

        for (const item of this.customs) {
            _format += UEOFParser.FM_PROPERTY + item.format();
        }

        _format += UEOFParser.FM_LINE + UEOFParser.FM_OBJECT_END + _name;
        return _format;
    }
}

export class UEOFAttributeParser extends Parser {
    public name: UEOFValueParser = new UEOFValueParser();
    public value: UEOFValueParser = new UEOFValueParser();

    public parse(cursor: _ParseCursor): boolean {
        let bValid: boolean = false;

        this._cursor = cursor.snapshot();
        this._cursor.start(cursor);

        bValid = true
            && this.name.parse(cursor)
            && tokenCharOnce(cursor, UEOFParser.FM_SET)
            && (tokenAny(cursor, UEOFParser.T_SPACE) || true);
        
        if (!bValid) { cursor.recover(this._cursor); this.name = null; }
  
        bValid = this.value.parse(cursor);

        this._cursor.end(cursor, bValid);
        if (!bValid) { cursor.recover(this._cursor); }
        return bValid;
    }

    public format(): string {
        return (this.name ? this.name.format() + UEOFParser.FM_SET : "") + this.value.format();
    }
}

export class UEOFPropertyParser extends Parser {
    public attribute: UEOFAttributeParser = new UEOFAttributeParser();
    public link: UEOFLinkParser = null;

    public parse(cursor: _ParseCursor): boolean {
        let bValid: boolean = false;
        let bLink: boolean = false;

        this._cursor = cursor.snapshot();
        this._cursor.start(cursor);

        bValid = true
            && this.attribute.parse(cursor);

        if (bValid) {
            this.link = new UEOFLinkParser();
            bLink = true
                && tokenAny(cursor, UEOFParser.T_SPACE)
                && this.link.parse(cursor);
            
            if (!bLink) { this.link = null; cursor.start(this.attribute.cursor); }
        }

        this._cursor.end(cursor, bValid);
        if (!bValid) { cursor.recover(this._cursor); }
        return bValid;
    }

    public format(): string {
        return this.attribute.format() + (this.link ? UEOFParser.FM_SPACE + this.link.format() : "");
    }
}

export class UEOFNameParser extends Parser  {
    public parse(cursor: _ParseCursor): boolean { 
        let bValid: boolean = false;
        
        this._cursor = cursor.snapshot();
        this._cursor.start(cursor);

        bValid = true
            && !tokenRangeOnce(cursor, UEOFParser.T_DIGIT, false)
            && tokenRanges(cursor, UEOFParser.T_NAME);

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

        bValid = tokenNotRanges(cursor, UEOFParser.T_RAW);;

        this._cursor.end(cursor, bValid);
        return bValid;
    }

    public format(): string {
        return this._cursor.result();
    }
}

export class UEOFTupleParser extends Parser  {
    public properties: Array<UEOFPropertyParser> = [];

    public parse(cursor: _ParseCursor): boolean {
        let bValid: boolean = false;
        let bNext: boolean = true;
        let bProperty: boolean = false;
        
        this._cursor = cursor.snapshot();
        this._cursor.start(cursor);

        bValid = tokenCharOnce(cursor, UEOFParser.FM_TUPLE_BEGIN);
        if (bValid) {
            while (bNext) {
                let property = new UEOFPropertyParser();
                tokenAny(cursor, UEOFParser.T_SPACE);
                bProperty = property.parse(cursor);
                if (bProperty) { this.properties.push(property); }
                tokenAny(cursor, UEOFParser.T_SPACE);
                bNext = tokenChar(cursor, UEOFParser.FM_DELIM);
            }
        }
        bValid &&= tokenCharOnce(cursor, UEOFParser.FM_TUPLE_END);

        this._cursor.end(cursor, bValid);
        if (!bValid) { cursor.recover(this._cursor); }
        return bValid;
    }

    public format(): string {
        let _format: string = UEOFParser.FM_TUPLE_BEGIN;
        let bFirst = true;
        for (const item of this.properties) {
            _format += (bFirst ? "" : UEOFParser.FM_DELIM) + item.format();
            bFirst = false;
        }
        _format += UEOFParser.FM_TUPLE_END;
        return _format;
    }
}

export class UEOFLinkParser extends Parser  {
    public relations: Array<UEOFPropertyParser> = [];

    public parse(cursor: _ParseCursor): boolean {
        let bValid: boolean = false;
        let bNext: boolean = true;
        let bRelation: boolean = false;
        
        this._cursor = cursor.snapshot();
        this._cursor.start(cursor);

        while (bNext) {
            let value = new UEOFPropertyParser();
            bRelation = value.parse(cursor);
            if (bRelation) { this.relations.push(value); }
            bNext = tokenChar(cursor, UEOFParser.FM_SPACE);
        }
        bValid = this.relations.length > 0;

        this._cursor.end(cursor, bValid);
        return bValid;
    }

    public format(): string {
        let _format: string = "";
        let bFirst = true;
        for (const item of this.relations) {
            _format += (bFirst ? "" : UEOFParser.FM_SPACE) + item.format();
            bFirst = false;
        }
        return _format;
    }
}

export class UEOFValueParser extends Parser  {
    public flag: EValueParser = EValueParser.NONE;
    public name: UEOFNameParser | UEOFRawParser = new UEOFNameParser();
    public raw: Parser = null;
    public concats: Array<UEOFValueParser> = [];

    protected option(flag: EValueParser, raw: Parser = null) : boolean {
        this.flag |= flag;
        this.raw = raw;
        return true;
    }

    protected recover(cursor: _ParseCursor): _ParseCursor {
        cursor.recover(this.name.cursor);
        return cursor;
    }

    public parse(cursor: _ParseCursor): boolean {
        let bValid: boolean = false;
        let _bValid: boolean = false;

        let _tuple = new UEOFTupleParser();
        let _string = new UEOFStringParser();
        let _raw = new UEOFRawParser();
        
        this._cursor = cursor.snapshot();
        this._cursor.start(cursor);

        bValid = this.name.parse(cursor) && this.option(EValueParser.NAME);
        _bValid = _raw.parse(cursor);
        if (_bValid) {
            this.flag = EValueParser.VALUE;
            _raw.cursor.union(this.name.cursor);
            this.name = _raw;
            bValid = true;
        }

        _bValid = false
            || (_string.parse(cursor) && this.option(EValueParser.STRING, _string))
            || (_tuple.parse(cursor) && this.option(EValueParser.TUPLE, _tuple));
        
        bValid ||= _bValid;

        if (this.concats) {
            let bConcat = true;
            while (bConcat) {
                let _concat = new UEOFValueParser();
                _concat.concats = null;
                bConcat = _concat.parse(cursor);
                if (bConcat) { this.concats.push(_concat); }
                
            }

            bConcat = this.concats.length > 0;
            if (bConcat) { this.flag |= EValueParser.CONCAT; }
        }

        this._cursor.end(cursor, bValid);
        if (!bValid) { cursor.recover(this._cursor); }
        return bValid;
    }

    public format(): string {
        let _format: string = this.name.format() + (this.raw ? this.raw.format() : "");
        if (this.concats) { for (const item of this.concats) { _format += item.format(); }; }
        // console.log(this.flag, _format);
        return _format;
    }
}

export class UEOFCustomParser extends Parser  {
    public name: UEOFNameParser = new UEOFNameParser();
    public properties: UEOFTupleParser = new UEOFTupleParser();

    public parse(cursor: _ParseCursor): boolean {
        let bValid: boolean = false;
        
        this._cursor = cursor.snapshot();
        this._cursor.start(cursor);

        bValid = true
            && token(cursor, UEOFParser.FM_CUSTOM)
            && tokenAny(cursor, UEOFParser.T_SPACE)
            && this.name.parse(cursor)
            && (tokenAny(cursor, UEOFParser.T_SPACE) || true)
            && this.properties.parse(cursor);

        this._cursor.end(cursor, bValid);
        if (!bValid) { cursor.recover(this._cursor); }
        return bValid;
    }

    public format(): string {
        return UEOFParser.FM_CUSTOM 
            + UEOFParser.FM_SPACE + this.name.format() + UEOFParser.FM_SPACE
            + this.properties.format();
    }
}

export class UEOFParser extends Parser  {
    public static readonly T_NAME = "azAZ09//\\\\::-.__";
    public static readonly T_DIGIT = "09";
    public static readonly T_CLEAR = "\x01\x20";
    public static readonly T_SPACE = " \t";
    public static readonly T_LINE = "\x0a\x0d";
    public static readonly T_RAW = "\x00\x20\x22\x22\x27\x29\x2c\x2c\x3d\x3d\x7f\x7f";

    public static readonly FM_SET = "=";
    public static readonly FM_CUSTOM = "CustomProperties";
    public static readonly FM_SPACE = " ";
    public static readonly FM_TUPLE_BEGIN = "(";
    public static readonly FM_TUPLE_END = ")";
    public static readonly FM_DELIM = ",";
    public static readonly FM_OBJECT_BEGIN = "Begin";
    public static readonly FM_OBJECT_END = "End";
    public static readonly FM_LINE = "\n";
    public static readonly FM_PROPERTY = "\n\t";

    public objects: Array<UEOFObjectParser> = [];
    
    public parse(cursor: _ParseCursor): boolean {
        let bValid: boolean = false;
        let bNext: boolean = true;

        tokenRange(cursor, UEOFParser.T_CLEAR);

        this._cursor = cursor.snapshot();
        this._cursor.start(cursor);

        while (bNext) {
            let object = new UEOFObjectParser();
            bValid = object.parse(cursor);
            if (bValid) { this.objects.push(object); }
            bNext = tokenRange(cursor, UEOFParser.T_LINE);
            tokenAny(cursor, UEOFParser.T_SPACE);
        }

        this._cursor.end(cursor, bValid);
        return bValid;
    }

    public format(): string {
        let _format: string = "";

        let bFirst = true;
        for (const item of this.objects) {
            _format += (bFirst ? "" : UEOFParser.FM_LINE) + item.format();
            bFirst = false;
        }
        return _format;
    }
}