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
        this.char = other.char;
        this.line = other.line;
        this.index = other.index;
    }

    public reset() {
        this.char = 0;
        this.line = 0;
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
        var _cursor: _ParseCursor = new _ParseCursor()
        _cursor.complete = this.complete;
        _cursor.from = this.from.snapshot();
        _cursor.to = this.to.snapshot();
        _cursor.data = this.data;
        return _cursor;
    }

    public reset() {
        this.from.reset();
        this.to.reset();
        this.complete = false;
    }
}