export class _ParseData {
    public offset: number = 0;
    public raw: String = "";
    public lines: Array<number> = [];
}

export class _ParsePosition {
    public line: number = 0;
    public char: number = 0;
    public index: number = 0;

    public snapshot(): _ParsePosition {
        let _position: _ParsePosition = new _ParsePosition()
        _position.line = this.line;
        _position.char = this.char;
        _position.index = this.index;
        return _position
    }

    public assign(other: _ParsePosition) {
        this.line = other.line;
        this.char = other.char;
        this.index = other.index;
    }

    public reset() {
        this.line = 0;
        this.char = 0;
        this.index = 0;
    }
}

export class _ParseCursor {
    public from: _ParsePosition = new _ParsePosition();
    public to: _ParsePosition = new _ParsePosition();
    public complete: boolean = false;
    public data: _ParseData = new _ParseData();

    constructor(raw: string = "") {
        this.data.raw = raw;
    }

    public snapshot(): _ParseCursor {
        let _cursor: _ParseCursor = new _ParseCursor()
        _cursor.complete = this.complete;
        _cursor.from = this.from.snapshot();
        _cursor.to = this.to.snapshot();
        _cursor.data = this.data;
        return _cursor;
    }

    public result(): string
    {
        return this.data.raw.substring(this.from.index, this.to.index);
    }

    public subresult(from: number, to: number): string
    {
        from = from < 0 ? this.from.index : from;
        to = to < 0 ? this.to.index : to;

        let bValid = from >= this.from.index && to <= this.to.index && from <= to;
        if (!bValid) { throw new RangeError(`range ${from} and ${to} not contained in ${this.from.index} and ${this.to.index}`); }
        return this.data.raw.substring(from, this.to.index);
    }

    public start(cursor: _ParseCursor)
    {
        this.from.assign(cursor.to);
    }

    public end(cursor: _ParseCursor, bComplete: boolean) {
        this.to.assign(cursor.to);
        this.complete = bComplete;
    }

    public recover(cursor: _ParseCursor) {
        this.to.assign(cursor.from);
    }

    public reset() {
        this.from.reset();
        this.to.reset();
        this.complete = false;
    }

    public rollback() {
        this.to.assign(this.from);
        this.complete = false;
    }

    public assert(): boolean {
        return this.to.index >= this.data.raw.length;
    }
}

export class Parser {
    protected _cursor: _ParseCursor = new _ParseCursor();

    public get cursor(): _ParseCursor { return this._cursor; }
    
    public parse(cursor: _ParseCursor): boolean {
        return false;
    }

    public format(): string {
        return null;
    }
}