export function insertSpacesBetweenCapitalizedWords(str: string) {
    str = str || '';
    return str.replace(/((?<=[a-z])[A-Z]+)/g, ' $1');
}

export function removePrefixB(str: string) {
    return str.replace(/^b(?=[A-Z])/g, '');
}

export function capitalizeTerm(str: string) {
    str = str.trim();
    return str.charAt(0).toUpperCase() + str.slice(1);
}

export function prettifyText(str: string) {
    return capitalizeTerm(
        insertSpacesBetweenCapitalizedWords(
            removePrefixB(str).replace(/[_]/g, ' ')
        )
    );
}

export function removeInsignificantTrailingZeros(str: string) {
    let labelAsNumber = Number(str);
    if (isNaN(labelAsNumber)) { return str; }
    if (Number.isInteger(labelAsNumber)) {
        return labelAsNumber + ".0";
    }
    return labelAsNumber.toString();
}

export function parseString(raw: string, escape: string = "\\"): string {
    const N = raw.length - 1;
    const bValid = N > 2;
    let bEscape = false;
    let _value = "";
    for (let n = 1; bValid && n < N; n++) {
        const _char = raw[n];
        bEscape = (raw[n] == escape) && !bEscape;
        if (!bEscape) { _value += _char; }
    }
    return _value;
}

export function parseStringSimple(raw: string): string {
    return raw.substring(1, raw.length - 1);
}

export function decodeHtmlText(htmlText: string): string {
    return htmlText.replace("lt;", "<").replace("gt;", ">");;
}
