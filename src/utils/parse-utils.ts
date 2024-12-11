export class _ParseData {
    public offset: number
    public raw: String
    public lines: Array<number>
}

export class _ParsePosition {
    public line: number
    public char: number
    public index: number

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
}

export class _ParseCursor {
    public from: _ParsePosition
    public to: _ParsePosition
    public complete: boolean
    public data: _ParseData

    public snapshot(): _ParseCursor {
        var _cursor: _ParseCursor = new _ParseCursor()
        _cursor.complete = this.complete;
        _cursor.from = this.from.snapshot();
        _cursor.to = this.to.snapshot();
        _cursor.data = this.data;
        return _cursor;
    }
}