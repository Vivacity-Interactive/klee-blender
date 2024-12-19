type SVGLoaderCallback = (icon: HTMLImageElement) => void;
type SVGLoaderEvent = { data: Blob, callback: SVGLoaderCallback };

export class SVGLoader {
    public static readonly SVG_DESC = { type: 'image/svg+xml;charset=utf-8' };

    private static _instance = new SVGLoader();
    
    public static get instance(): SVGLoader {
        return (SVGLoader._instance ??= new SVGLoader());
    }

    private _buffer = new Image();
    private _queue: Array<SVGLoaderEvent> = [];
    private _event: SVGLoaderEvent = null;
    private _id: number = 0;

    private _poll() {
        const bPoll = this._queue.length > 0 && !this._event;
        
        if (bPoll) {
            this._event = this._queue.pop();

            //let blob = new Blob([ this._event.entry.data ], SVGLoader.SVG_DESC);
            const _url = URL.createObjectURL(this._event.data);
            const _this = this;

            this._buffer.onload = () => {
                _this._event.callback(_this._buffer);
                URL.revokeObjectURL(_url);
                _this._id = requestAnimationFrame(_this._poll);
            }

            this._buffer.src = _url;
        }
    }

    public queue(data: Blob, callback: SVGLoaderCallback) {
        const bBlob = data && data.size > 0;
        if (bBlob) {
            let loader = SVGLoader.instance;
            loader._queue.push({ data, callback });
            if (!this._id) { this._id = requestAnimationFrame(() => this._poll()); }
        }
    }
}