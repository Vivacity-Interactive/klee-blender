import { UnitTest } from "./unit-test";
import { _ParseCursor, _ParseData } from "../utils/parse-utils";
import { UEOFLinkParser, UEOFObjectParser, UEOFCustomParser, UEOFPropertyParser, UEOFRawParser, UEOFStringParser, UEOFTupleParser, UEOFValueParser, UEOFParser } from "../parser/ueof-parser"

export class UnitTestUEOFParser extends UnitTest {
    protected DATA_NULL = null;
    protected DATA_EMPTY = "";
    protected DATA_NO_SOMTHING = "No Something";
    protected DATA_OBJECT_EMPTY = "Begin Object\nEnd Object";
    protected DATA_OBJECT_BLENDER: string = <string>require("./object-blender.ueof").default;
    protected DATA_OBJECT_UE: string = <string>require("./object-ue.ueof").default;
    protected DATA_COMPLEX_BLENDER: string = <string>require("./complex-blender.ueof").default;
    protected DATA_COMPLEX_UE: string = <string>require("./complex-ue.ueof").default;
    protected DATA_COMPLEX: string = <string>require("./complex.ueof").default;
    protected DATA_SIMPLE: string = <string>require("./simple.ueof").default;
    protected DATA_SIMPLE_ATTRIBUTES: string = <string>require("./simple-attributes.ueof").default;
    protected DATA_SIMPLE_PROPERTIES: string = <string>require("./simple-properties.ueof").default;
    protected DATA_SIMPLE_PINS: string = <string>require("./simple-pins.ueof").default;
    protected DATA_VALUES: string = <string>require("./values.ueof").default;
    protected DATA_PROPERTIES: string = <string>require("./properties.ueof").default;
    
    protected DATA_PROPERTIES_EXTRA: string = <string>require("./properties-extra.ueof").default;
    protected DATA_ALL_UE: string = <string>require("./all-ue.ueof").default;
    protected DATA_FIX_OBJECT_UE: string = <string>require("./fix-object-ue.ueof").default;

    public testObjectParser() {
        const _Parser = UEOFObjectParser;
        let cursor = new _ParseCursor();;
        let parser = null;
        let format = "";

        cursor.reset();
        cursor.data.raw = this.DATA_NULL;
        parser = new _Parser();
        this.Assert.Error(TypeError, () => parser.parse(cursor));
        this.Assert.True(cursor.to.index == 0);

        cursor.reset();
        cursor.data.raw = this.DATA_EMPTY;
        parser = new _Parser();
        this.Assert.False(parser.parse(cursor));
        this.Assert.True(cursor.to.index == 0);

        cursor.reset();
        cursor.data.raw = this.DATA_NO_SOMTHING;
        parser = new _Parser();
        this.Assert.False(parser.parse(cursor));
        this.Assert.True(cursor.to.index == 0);

        cursor.reset();
        cursor.data.raw = this.DATA_OBJECT_EMPTY;
        parser = new _Parser();
        this.Assert.True(parser.parse(cursor));
        this.Assert.False(parser.parse(cursor));
        this.Assert.True(cursor.to.index == cursor.data.raw.length);

        cursor.reset();
        cursor.data.raw = this.DATA_SIMPLE_ATTRIBUTES;
        parser = new _Parser();
        this.Assert.True(parser.parse(cursor));
        this.Assert.False(parser.parse(cursor));
        this.Assert.True(cursor.to.index == cursor.data.raw.length);
        //console.log(parser.format());

        cursor.reset();
        cursor.data.raw = this.DATA_SIMPLE_PROPERTIES;
        parser = new _Parser();
        this.Assert.True(parser.parse(cursor));
        this.Assert.False(parser.parse(cursor));
        this.Assert.True(cursor.to.index == cursor.data.raw.length);
        //console.log(parser.format());

        cursor.reset();
        cursor.data.raw = this.DATA_SIMPLE_PINS;
        parser = new _Parser();
        this.Assert.True(parser.parse(cursor));
        this.Assert.False(parser.parse(cursor));
        this.Assert.True(cursor.to.index == cursor.data.raw.length);
        //console.log(parser.format());

        cursor.reset();
        cursor.data.raw = this.DATA_SIMPLE;
        parser = new _Parser();
        this.Assert.True(parser.parse(cursor));
        this.Assert.False(parser.parse(cursor));
        this.Assert.True(cursor.to.index == cursor.data.raw.length);
        //console.log(parser.format());

        cursor.reset();
        cursor.data.raw = this.DATA_COMPLEX;
        parser = new _Parser();
        this.Assert.True(parser.parse(cursor));
        this.Assert.False(parser.parse(cursor));
        this.Assert.True(cursor.to.index == cursor.data.raw.length);
        //console.log(parser.format());

        cursor.reset();
        cursor.data.raw = this.DATA_OBJECT_BLENDER;
        parser = new _Parser();
        this.Assert.True(parser.parse(cursor));
        this.Assert.False(parser.parse(cursor));
        this.Assert.True(cursor.to.index == cursor.data.raw.length);
        //console.log(parser.format());

        cursor.reset();
        cursor.data.raw = this.DATA_OBJECT_UE;
        parser = new _Parser();
        this.Assert.True(parser.parse(cursor));
        this.Assert.False(parser.parse(cursor));
        this.Assert.True(cursor.to.index == cursor.data.raw.length);
        //console.log(parser.format());
    }

    public testPropertyParser() {
        const _Parser = UEOFPropertyParser;
        let cursor = new _ParseCursor();;
        let parser = null;
        let index = 0;
        let format = "";
        let properties = this.DATA_PROPERTIES.split(/\r?\n/);

        cursor.reset();
        cursor.data.raw = this.DATA_NULL;
        parser = new _Parser();
        this.Assert.Error(TypeError, () => parser.parse(cursor));
        this.Assert.True(cursor.to.index == 0);

        cursor.reset();
        cursor.data.raw = this.DATA_EMPTY;
        parser = new _Parser();
        this.Assert.False(parser.parse(cursor));
        this.Assert.True(cursor.to.index == 0);

        index = 0;
        for (const data of properties) {
            cursor.reset();
            cursor.data.raw = data;
            parser = new _Parser();
            this.Assert.True(parser.parse(cursor), `${index} not a property: ${data}`);
            this.Assert.True(cursor.to.index == cursor.data.raw.length, `${index} has invalid cursor: ${data}`);
            
            format = parser.format();
            this.Assert.Equal(data, format, `${index} not equal: \n\t\t:${format}\n\t\t:${data}`);
            //console.log(format);

            index++;
        }
    }

    public testValueParser() {
        const _Parser = UEOFValueParser;
        let cursor = new _ParseCursor();;
        let parser = null;
        let index = 0;
        let format = "";
        let values = this.DATA_VALUES.split(/\r?\n/);

        cursor.reset();
        cursor.data.raw = this.DATA_NULL;
        parser = new _Parser();
        this.Assert.Error(TypeError, () => parser.parse(cursor));
        this.Assert.True(cursor.to.index == 0);

        cursor.reset();
        cursor.data.raw = this.DATA_EMPTY;
        parser = new _Parser();
        this.Assert.False(parser.parse(cursor));
        this.Assert.True(cursor.to.index == 0);

        index = 0;
        for (const data of values) {
            cursor.reset();
            cursor.data.raw = data;
            parser = new _Parser();
            this.Assert.True(parser.parse(cursor), `${index} not a value: ${data}`);
            this.Assert.True(cursor.to.index == cursor.data.raw.length, `${index} has invalid cursor: ${data}`);
            
            format = parser.format();
            this.Assert.Equal(data, format, `${index} not equal: \n\t\t:${format}\n\t\t:${data}`);
            //console.log(format);
            
            index++;
        }
    }

    public testTupleParser() {
        const _Parser = UEOFTupleParser;
        let cursor = new _ParseCursor();;
        let parser = null;

        cursor.reset();
        cursor.data.raw = this.DATA_NULL;
        parser = new _Parser();
        this.Assert.Error(TypeError, () => parser.parse(cursor));
        this.Assert.True(cursor.to.index == 0);

        cursor.reset();
        cursor.data.raw = this.DATA_EMPTY;
        parser = new _Parser();
        this.Assert.False(parser.parse(cursor));
        this.Assert.True(cursor.to.index == 0);
    }

    public testStringParser() {
        const _Parser = UEOFStringParser;
        let cursor = new _ParseCursor();;
        let parser = null;

        cursor.reset();
        cursor.data.raw = this.DATA_NULL;
        parser = new _Parser();
        this.Assert.Error(TypeError, () => parser.parse(cursor));
        this.Assert.True(cursor.to.index == 0);

        cursor.reset();
        cursor.data.raw = this.DATA_EMPTY;
        parser = new _Parser();
        this.Assert.False(parser.parse(cursor));
        this.Assert.True(cursor.to.index == 0);
    }

    public testRawParser() {
        const _Parser = UEOFRawParser;
        let cursor = new _ParseCursor();;
        let parser = null;

        cursor.reset();
        cursor.data.raw = this.DATA_NULL;
        parser = new _Parser();
        this.Assert.Error(TypeError, () => parser.parse(cursor));
        this.Assert.True(cursor.to.index == 0);

        cursor.reset();
        cursor.data.raw = this.DATA_EMPTY;
        parser = new _Parser();
        this.Assert.False(parser.parse(cursor));
        this.Assert.True(cursor.to.index == 0);
    }

    public testLinkParser() {
        const _Parser = UEOFLinkParser;
        let cursor = new _ParseCursor();;
        let parser = null;

        cursor.reset();
        cursor.data.raw = this.DATA_NULL;
        parser = new _Parser();
        this.Assert.Error(TypeError, () => parser.parse(cursor));
        this.Assert.True(cursor.to.index == 0);

        cursor.reset();
        cursor.data.raw = this.DATA_EMPTY;
        parser = new _Parser();
        this.Assert.False(parser.parse(cursor));
        this.Assert.True(cursor.to.index == 0);
    }

    public testPinParser() {
        const _Parser = UEOFCustomParser;
        let cursor = new _ParseCursor();;
        let parser = null;

        cursor.reset();
        cursor.data.raw = this.DATA_NULL;
        parser = new _Parser();
        this.Assert.Error(TypeError, () => parser.parse(cursor));
        this.Assert.True(cursor.to.index == 0);

        cursor.reset();
        cursor.data.raw = this.DATA_EMPTY;
        parser = new _Parser();
        this.Assert.False(parser.parse(cursor));
        this.Assert.True(cursor.to.index == 0);
    }

    public testUEOFParser() {
        const _Parser = UEOFParser;
        let cursor = new _ParseCursor();;
        let parser = null;

        cursor.reset();
        cursor.data.raw = this.DATA_NULL;
        parser = new _Parser();
        this.Assert.Error(TypeError, () => parser.parse(cursor));
        this.Assert.True(cursor.to.index == 0);

        cursor.reset();
        cursor.data.raw = this.DATA_EMPTY;
        parser = new _Parser();
        this.Assert.False(parser.parse(cursor));
        this.Assert.True(cursor.to.index == 0);

        cursor.reset();
        cursor.data.raw = this.DATA_COMPLEX_BLENDER;
        parser = new _Parser();
        this.Assert.True(parser.parse(cursor));
        this.Assert.False(parser.parse(cursor));
        this.Assert.True(cursor.to.index == cursor.data.raw.length);
        //console.log(parser.format());

        cursor.reset();
        cursor.data.raw = this.DATA_COMPLEX_UE;
        parser = new _Parser();
        this.Assert.True(parser.parse(cursor));
        this.Assert.False(parser.parse(cursor));
        this.Assert.True(cursor.to.index == cursor.data.raw.length);
        //console.log(parser.format());
    }

    public testParserExtraProperties() {
        const _Parser = UEOFPropertyParser;
        let cursor = new _ParseCursor();;
        let parser = null;
        let index = 0;
        let format = "";
        let propertiesExtra = this.DATA_PROPERTIES_EXTRA.split(/\r?\n/);

        index = 0;
        for (const data of propertiesExtra) {
            cursor.reset();
            cursor.data.raw = data;
            parser = new _Parser();
            this.Assert.True(parser.parse(cursor), `${index} not a property: ${data}`);
            this.Assert.True(cursor.to.index == cursor.data.raw.length, `${index} has invalid cursor: ${data}`);
            
            format = parser.format();
            this.Assert.Equal(data, format, `${index} not equal: \n\t\t:${format}\n\t\t:${data}`);
            //console.log(format);

            index++;
        }
    }

    public DISABLED_testParserAll() {
        const _Parser = UEOFParser;
        let cursor = new _ParseCursor();;
        let parser = null;

        cursor.reset();
        cursor.data.raw = this.DATA_ALL_UE;
        parser = new _Parser();
        this.Assert.True(parser.parse(cursor));
        this.Assert.False(parser.parse(cursor));
        this.Assert.True(cursor.to.index == cursor.data.raw.length);
        //console.log(parser.format());
    }

    public DISABLED_testParserFixObject() {
        const _Parser = UEOFObjectParser;
        let cursor = new _ParseCursor();;
        let parser = null;

        cursor.reset();
        cursor.data.raw = this.DATA_FIX_OBJECT_UE;
        parser = new _Parser();
        this.Assert.True(parser.parse(cursor));
        this.Assert.False(parser.parse(cursor));
        this.Assert.True(cursor.to.index == cursor.data.raw.length);
        //console.log(parser.format());
    }
}