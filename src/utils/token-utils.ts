import { _ParseCursor, _ParseData } from "./parse-utils";

export const TOKEN_UTILS_SPACE: string = " \t\n\r\v\b\f\a"
export const TOKEN_UTILS_STRING: string = "\"'`"
export const TOKEN_UTILS_ESCAPE: string = "\\"
export const TOKEN_UTILS_LINE: string = "\n\r"

export function token(cursor: _ParseCursor, token: string, bConsume: boolean = true): boolean {
    let data: _ParseData = cursor.data;
    let _index: number = cursor.to.index;
    let bValid: boolean = (_index + token.length) <= data.raw.length;

    for (let i = 0; i < token.length && bValid; i++) {
        bValid &&= data.raw[_index + i] == token[i];
    }

    if (bValid && bConsume) { cursor.to.index += token.length; }

    return bValid;
}

export function tokenAny(cursor: _ParseCursor, chars: string, bConsume: boolean = true): boolean {
    let data: _ParseData = cursor.data;
    let bValid: boolean = cursor.to.index < data.raw.length;
    let _index: number = cursor.to.index;

    for (; _index < data.raw.length && bValid; _index++) {
        bValid = false;
        for (let j = 0; j < chars.length && !bValid; j++) {
            bValid ||= data.raw[_index] == chars[j];
        }
    }

    if (bValid && bConsume) { cursor.to.index = _index; }

    return bValid;
}

export function tokenString(cursor: _ParseCursor, bConsume: boolean = true, chars: string = TOKEN_UTILS_STRING, escape: string = TOKEN_UTILS_ESCAPE): boolean {
    let data: _ParseData = cursor.data;
    let bValid: boolean = cursor.to.index < data.raw.length;
    let bEscape: boolean = false;
    let _index: number = cursor.to.index;
    let index:number = 0;
    
    for (; index < chars.length && !bValid; index++) {
        bValid ||= data.raw[_index] == chars[index];
        _index++;
    }

    let token:string = chars[index];
    for (; _index < data.raw.length && !bValid; _index++) {
        bEscape = (data.raw[_index] == escape) != bEscape;
        bValid = !bEscape && data.raw[_index] == token;
    }

    if (bValid && bConsume) { cursor.to.index = _index; }

    return bValid;
}

export function tokenValue(cursor: _ParseCursor, bConsume: boolean = true, space: string = TOKEN_UTILS_SPACE): boolean {
    let data: _ParseData = cursor.data;
    let bValid: boolean = cursor.to.index < data.raw.length;
    let _index: number = cursor.to.index;

    for (; _index < data.raw.length && !bValid; _index++) {
        bValid = false;
        for (let j = 0; j < space.length && !bValid; j++) {
            bValid ||= data.raw[_index] == space[j];
        }
    }

    if (bValid && bConsume) { cursor.to.index = _index; }

    return bValid;
}