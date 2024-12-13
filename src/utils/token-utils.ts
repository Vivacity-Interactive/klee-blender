import { _ParseCursor, _ParseData } from "./parse-utils";

export const TOKEN_UTILS_SPACE_STRICT: string = " \t";
export const TOKEN_UTILS_SPACE_LINELESS: string = " \t\v\f\a\b";
export const TOKEN_UTILS_SPACE: string = " \t\n\r\v\f\a\b";
export const TOKEN_UTILS_SPACE_RANGE: string = "\x01\x20";
export const TOKEN_UTILS_STRING: string = "\"'`";
export const TOKEN_UTILS_ESCAPE: string = "\\";
export const TOKEN_UTILS_LINE: string = "\n\r";
export const TOKEN_UTILS_ALPHA_RANGE: string = "azAZ";
export const TOKEN_UTILS_DIGIT_RANGE: string = "09";

export function token(cursor: _ParseCursor, token: string, bConsume: boolean = true): boolean {
    let data: _ParseData = cursor.data;
    let _index: number = cursor.to.index;
    let bValid: boolean = (_index + token.length - 1) <= data.raw.length && token.length > 0;

    for (let i = 0; i < token.length && bValid; i++) {
        bValid &&= data.raw[_index + i] == token[i];
    }

    if (bValid && bConsume) { cursor.to.index += token.length; }

    return bValid;
}

export function tokenAny(cursor: _ParseCursor, chars: string, bConsume: boolean = true): boolean {
    let data: _ParseData = cursor.data;
    let bValid: boolean = false;
    let bContext: boolean = chars.length > 0;
    let _index: number = cursor.to.index;
    
    for (; _index < data.raw.length && bContext; _index++) {
        bValid = bContext;
        bContext = false;
        for (let j = 0; j < chars.length && !bContext; j++) {
            bContext ||= data.raw[_index] == chars[j];
        }
    }

    bValid &&= (_index - 1) != cursor.to.index;

    if (bValid && bConsume) { cursor.to.index = bContext ? _index : _index - 1; }

    return bValid;
}

export function tokenRange(cursor: _ParseCursor, range: string = TOKEN_UTILS_SPACE_RANGE, bConsume: boolean = true): boolean {
    let data: _ParseData = cursor.data;
    let bValid: boolean = false;
    let bContext: boolean = range.length >= 2;
    let _index: number = cursor.to.index;
    let _char: string = "";
    
    for (; _index < data.raw.length && bContext; _index++) {
        bValid = bContext;
        _char = data.raw[_index];
        bContext = _char >= range[0] && _char <= range[1];
    }

    bValid &&= (_index - 1) != cursor.to.index;
    
    if (bValid && bConsume) { cursor.to.index = bContext ? _index : _index - 1; }

    return bValid;
}

export function tokenNotRange(cursor: _ParseCursor, range: string = TOKEN_UTILS_SPACE_RANGE, bConsume: boolean = true): boolean {
    let data: _ParseData = cursor.data;
    let bValid: boolean = false;
    let bContext: boolean = range.length >= 2;
    let _index: number = cursor.to.index;
    let _char: string = "";

    for (; _index < data.raw.length && bContext; _index++) {
        bValid = bContext;
        _char = data.raw[_index];
        bContext = _char < range[0] || _char > range[1];
    }

    bValid &&= (_index - 1) != cursor.to.index;
    
    if (bValid && bConsume) { cursor.to.index = bContext ? _index : _index - 1; }

    return bValid;
}

export function tokenRanges(cursor: _ParseCursor, ranges: string, bConsume: boolean = true): boolean {
    let data: _ParseData = cursor.data;
    let bValid: boolean = false;
    let bContext: boolean = ranges.length >= 2;
    let _index: number = cursor.to.index;
    let _char: string = "";
    let N: number = Math.floor(ranges.length/2);
    
    for (; _index < data.raw.length && bContext; _index++) {
        bValid = bContext;
        _char = data.raw[_index];
        bContext = false;
        for (let j = 0; j < N && !bContext; j++) {
            bContext ||= _char >= ranges[j*2] && _char <= ranges[j*2 + 1];
        } 
    }

    bValid &&= (_index - 1) != cursor.to.index;
    
    if (bValid && bConsume) { cursor.to.index = bContext ? _index : _index - 1; }

    return bValid;
}

export function tokenNotRanges(cursor: _ParseCursor, ranges: string, bConsume: boolean = true): boolean {
    let data: _ParseData = cursor.data;
    let bValid: boolean = false;
    let bContext: boolean = ranges.length >= 2;
    let _index: number = cursor.to.index;
    let _char: string = "";
    let N: number = Math.floor(ranges.length/2);

    for (; _index < data.raw.length && bContext; _index++) {
        bValid = bContext;
        _char = data.raw[_index];
        for (let j = 0; j < N && bContext; j++) {
            bContext &&= _char < ranges[j*2] || _char > ranges[j*2 + 1];
        } 
    }

    bValid &&= (_index - 1) != cursor.to.index;
    
    if (bValid && bConsume) { cursor.to.index = bContext ? _index : _index - 1; }

    return bValid;
}

export function tokenString(cursor: _ParseCursor, bConsume: boolean = true, chars: string = TOKEN_UTILS_STRING, escape: string = TOKEN_UTILS_ESCAPE): boolean {
    let data: _ParseData = cursor.data;
    let bValid: boolean = false;
    let bContext: boolean = cursor.to.index < data.raw.length && chars.length > 0;
    let bEscape: boolean = false;
    let _index: number = cursor.to.index;
    let index:number = 0;
    let token:string = "";

    if (bContext) {
        bContext = false;
        for (; index < chars.length && !bContext; index++) {
            bContext ||= data.raw[_index] == chars[index];
            _index++;
        }

        token = chars[index - 1];
        for (; _index < data.raw.length && !bValid && bContext; _index++) {
            bValid = !bEscape && data.raw[_index] == token;
            bEscape = (data.raw[_index] == escape) && !bEscape;
        }
    }

    if (bValid && bConsume) { cursor.to.index = _index; }

    return bValid;
}

export function tokenValue(cursor: _ParseCursor, bConsume: boolean = true, space: string = TOKEN_UTILS_SPACE_STRICT): boolean {
    let data: _ParseData = cursor.data;
    let bValid: boolean = false;
    let bContext: boolean = space.length > 0;
    let _index: number = cursor.to.index;

    for (; _index < data.raw.length && bContext; _index++) {
        bValid = bContext;
        for (let j = 0; j < space.length && bContext; j++) {
            bContext &&= data.raw[_index] != space[j];
        }
    }

    bValid &&= (_index - 1) != cursor.to.index;
    
    if (bValid && bConsume) { cursor.to.index = bContext ? _index : _index - 1; }

    return bValid;
}