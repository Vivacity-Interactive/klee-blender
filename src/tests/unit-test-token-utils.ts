import { UnitTest } from "./unit-test";
import { _ParseCursor, _ParseData } from "../utils/parse-utils";
import { token, TOKEN_UTILS_LINE, tokenAny, tokenRange, tokenString, tokenValue, tokenNotRange } from "../utils/token-utils"

export class UnitTestTokenUtils extends UnitTest {
    protected TOKEN = "token";
    protected DATA_NULL = null;
    protected DATA_EMPTY = "";
    protected DATA_SPACE_STRICT = "  \t  ";
    protected DATA_LINE = "\n\n\r";
    protected DATA_SPACE = " \x01\t\r  \x20 ";
    protected DATA_VALUE = "dowe:jl_^rnelr";
    protected DATA_STRING = "\"hiding in context\"";
    protected DATA_STRING_ESCAPE = "\"hiding \\ \\\"in \\\" context\"";
    protected DATA_STRING_ESCAPE_A = "\"hiding in context\\\\\"";
    protected DATA_STRING_ESCAPE_ODD_A = "\"hiding in \\\"context\"";
    protected DATA_STRING_ESCAPE_EVEN_A = "\"hiding in \\\\\"context\"";
    protected DATA_STRING_ESCAPE_ODD_B = "\"hiding in \\\\\\\"context\"";
    protected DATA_STRING_ESCAPE_EVEN_B = "\"hiding in \\\\\\\\\"context\"";
    protected DATA_STRING_A = "\"`'hiding in context'`\"";
    protected DATA_STRING_B = "`'\"hiding in context\"'`";

    public testToken()
    {
        let cursor = new _ParseCursor();
        let N = 5;

        cursor.reset();
        cursor.data.raw = this.DATA_NULL;
        this.Assert.Error(TypeError, () => token(cursor, this.TOKEN));
        
        cursor.reset();
        cursor.data.raw = this.DATA_EMPTY;
        this.Assert.False(token(cursor, this.TOKEN));

        cursor.reset();
        cursor.data.raw = this.TOKEN;
        this.Assert.True(token(cursor, this.TOKEN));
        this.Assert.False(token(cursor, this.TOKEN));

        cursor.reset();
        cursor.data.raw = this.TOKEN.repeat(N);
        for (let n = 0; n < N; n++) {
            this.Assert.True(token(cursor, this.TOKEN));
        }
        this.Assert.False(token(cursor, this.TOKEN));
        this.Assert.True(cursor.to.index == cursor.data.raw.length);
        
        cursor.reset();
        cursor.data.raw = " "+this.TOKEN;
        this.Assert.False(token(cursor, this.TOKEN));

        cursor.reset();
        cursor.data.raw = this.TOKEN+" ";
        this.Assert.True(token(cursor, this.TOKEN));
        this.Assert.False(token(cursor, this.TOKEN));
    }

    public testTokenAny()
    {
        let cursor = new _ParseCursor();

        cursor.reset();
        cursor.data.raw = this.DATA_NULL;
        this.Assert.Error(TypeError, () => token(cursor, TOKEN_UTILS_LINE));
        
        cursor.reset();
        cursor.data.raw = this.DATA_EMPTY;
        this.Assert.False(token(cursor, TOKEN_UTILS_LINE));

        cursor.reset();
        cursor.data.raw = this.DATA_LINE;
        this.Assert.True(tokenAny(cursor, TOKEN_UTILS_LINE));
        this.Assert.False(tokenAny(cursor, TOKEN_UTILS_LINE));

        cursor.reset();
        cursor.data.raw = " "+this.DATA_LINE;
        this.Assert.False(tokenAny(cursor, TOKEN_UTILS_LINE));

        cursor.reset();
        cursor.data.raw = this.DATA_LINE+" ";
        this.Assert.True(tokenAny(cursor, TOKEN_UTILS_LINE));
        this.Assert.False(tokenAny(cursor, TOKEN_UTILS_LINE));
    }

    public testTokenRange()
    {
        let cursor = new _ParseCursor();

        cursor.reset();
        cursor.data.raw = this.DATA_NULL;
        this.Assert.Error(TypeError, () => tokenRange(cursor));
        
        cursor.reset();
        cursor.data.raw = this.DATA_EMPTY;
        this.Assert.False(tokenRange(cursor));

        cursor.reset();
        cursor.data.raw = this.DATA_SPACE;
        this.Assert.True(tokenRange(cursor));

        cursor.reset();
        cursor.data.raw = "_"+this.DATA_SPACE;
        this.Assert.False(tokenRange(cursor));

        cursor.reset();
        cursor.data.raw = this.DATA_SPACE+"_";
        this.Assert.True(tokenRange(cursor));
        this.Assert.False(tokenRange(cursor));
    }

    public testTokenNotRange()
    {
        let cursor = new _ParseCursor();
        let N = 5;

        cursor.reset();
        cursor.data.raw = this.DATA_NULL;
        this.Assert.Error(TypeError, () => tokenNotRange(cursor));
        
        cursor.reset();
        cursor.data.raw = this.DATA_EMPTY;
        this.Assert.False(tokenNotRange(cursor));

        cursor.reset();
        cursor.data.raw = this.DATA_VALUE;
        this.Assert.True(tokenNotRange(cursor));
        this.Assert.False(tokenNotRange(cursor));

        cursor.reset();
        cursor.data.raw = " "+this.DATA_VALUE;
        this.Assert.False(tokenNotRange(cursor));

        cursor.reset();
        cursor.data.raw = this.DATA_VALUE+" ";
        this.Assert.True(tokenNotRange(cursor));
        this.Assert.False(tokenNotRange(cursor));
    }

    public testTokenString()
    {
        let cursor = new _ParseCursor();
        let N = 5;

        cursor.reset();
        cursor.data.raw = this.DATA_NULL;
        this.Assert.Error(TypeError, () => tokenString(cursor));
        
        cursor.reset();
        cursor.data.raw = this.DATA_EMPTY;
        this.Assert.False(tokenString(cursor));

        cursor.reset();
        cursor.data.raw = this.DATA_STRING;
        this.Assert.True(tokenString(cursor));
        this.Assert.False(tokenString(cursor));

        cursor.reset();
        cursor.data.raw = this.DATA_STRING.repeat(N);
        for (let n = 0; n < N; n++) {
            this.Assert.True(tokenString(cursor));
        }
        this.Assert.False(tokenString(cursor));
        this.Assert.True(cursor.to.index == cursor.data.raw.length);

        cursor.reset();
        cursor.data.raw = " "+this.DATA_STRING;
        this.Assert.False(tokenString(cursor));

        cursor.reset();
        cursor.data.raw = this.DATA_STRING+" ";
        this.Assert.True(tokenString(cursor));
        this.Assert.False(tokenString(cursor));

        cursor.reset();
        cursor.data.raw = this.DATA_STRING_A;
        this.Assert.True(tokenString(cursor));
        this.Assert.False(tokenString(cursor));

        cursor.reset();
        cursor.data.raw = this.DATA_STRING_B;
        this.Assert.True(tokenString(cursor));
        this.Assert.False(tokenString(cursor));

        cursor.reset();
        cursor.data.raw = this.DATA_STRING_ESCAPE_A;
        this.Assert.True(tokenString(cursor));
        this.Assert.False(tokenString(cursor));

        cursor.reset();
        cursor.data.raw = this.DATA_STRING_ESCAPE_A.repeat(N);
        for (let n = 0; n < N; n++) {
            this.Assert.True(tokenString(cursor));
        }
        this.Assert.False(tokenString(cursor));
        this.Assert.True(cursor.to.index == cursor.data.raw.length);

        cursor.reset();
        cursor.data.raw = this.DATA_STRING_ESCAPE;
        this.Assert.True(tokenString(cursor));
        this.Assert.False(tokenString(cursor));

        cursor.reset();
        cursor.data.raw = this.DATA_STRING_ESCAPE.repeat(N);
        for (let n = 0; n < N; n++) {
            this.Assert.True(tokenString(cursor));
        }
        this.Assert.False(tokenString(cursor));
        this.Assert.True(cursor.to.index == cursor.data.raw.length);

        cursor.reset();
        cursor.data.raw = this.DATA_STRING_ESCAPE_EVEN_A;
        this.Assert.True(tokenString(cursor));
        this.Assert.False(tokenString(cursor));

        cursor.reset();
        cursor.data.raw = this.DATA_STRING_ESCAPE_ODD_A;
        this.Assert.True(tokenString(cursor));
        this.Assert.False(tokenString(cursor));

        cursor.reset();
        cursor.data.raw = this.DATA_STRING_ESCAPE_EVEN_B;
        this.Assert.True(tokenString(cursor));
        this.Assert.False(tokenString(cursor));

        cursor.reset();
        cursor.data.raw = this.DATA_STRING_ESCAPE_ODD_B;
        this.Assert.True(tokenString(cursor));
        this.Assert.False(tokenString(cursor));
    }

    public testTokenValue()
    {
        let cursor = new _ParseCursor();

        cursor.reset();
        cursor.data.raw = this.DATA_NULL;
        this.Assert.Error(TypeError, () => tokenValue(cursor));
        
        cursor.reset();
        cursor.data.raw = this.DATA_EMPTY;
        this.Assert.False(tokenValue(cursor));

        cursor.reset();
        cursor.data.raw = " ";
        this.Assert.False(tokenValue(cursor));

        cursor.reset();
        cursor.data.raw = this.DATA_VALUE;
        this.Assert.True(tokenValue(cursor));
        this.Assert.False(tokenValue(cursor));
        this.Assert.True(cursor.to.index == cursor.data.raw.length);

        cursor.reset();
        cursor.data.raw = " "+this.DATA_VALUE;
        this.Assert.False(tokenValue(cursor));

        cursor.reset();
        cursor.data.raw = this.DATA_VALUE+" ";
        this.Assert.True(tokenValue(cursor));
        this.Assert.False(tokenValue(cursor));
    }
}