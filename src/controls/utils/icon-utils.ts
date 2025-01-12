import { IconData } from "./icon-library";

const SVG_DESC = { type: 'image/svg+xml;charset=utf-8' };

type SVGLoaderCallback = (icon: HTMLImageElement) => void;
type SVGLoaderEvent = { data: string, callback: SVGLoaderCallback };

type SVGIconCallback = (icon: SVGIcon) => void;

export enum IconState {
    None = 0,
    Ready = 1 << 0,
    Loading = 1 << 1,
    Unknown = 1 << 2
}

export class SVGLoader {
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
            let blob = new Blob([ this._event.data ], SVG_DESC);
            const _url = URL.createObjectURL(blob);
            const _this = this;

            this._buffer.onload = () => {
                _this._event.callback(_this._buffer);
                URL.revokeObjectURL(_url);
                _this._id = requestAnimationFrame(_this._poll);
            }

            this._buffer.src = _url;
        }
    }

    public queue(data: string, callback: SVGLoaderCallback, before = null) {
        const bData = data && data.length > 0;
        if (bData) {
            let loader = SVGLoader.instance;
            loader._queue.push({ data, callback });
            if (!this._id) { this._id = requestAnimationFrame(() => this._poll()); }
        }
    }
}

export class SVGIcon extends Image {
    public pt: number = 10;
    public ratio: number = 1.0;
    private _queue: SVGIconCallback[] = [];

    constructor(data: IconData, callback?: SVGIconCallback, color?: string) {
        super()
        let _blob = new Blob([ color ? data.raw.replace(/#ff+/g,color) : data.raw ], SVG_DESC);
        let _url = URL.createObjectURL(_blob);
        this.ratio = data.ratio;
        const _this = this;

        if(callback) { this._queue.push(callback); }

        this.onload = () => {
            for (const trigger of _this._queue) { trigger(_this); }
            URL.revokeObjectURL(_url);
        };

        this.src = _url
    }

    public queue(callback: SVGIconCallback) {
        if (!this.complete) { this._queue.push(callback); }
        else { callback(this); }
    }
}
