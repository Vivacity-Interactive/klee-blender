import { IconData } from "./icon-library";

const SVG_DESC = { type: 'image/svg+xml;charset=utf-8' };

type SVGLoaderCallback = (icon: HTMLImageElement) => void;
type SVGLoaderEvent = { data: string, callback: SVGLoaderCallback };

type SVGIconCallback = (icon: HTMLImageElement, ration: number) => void;

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
    public pt:number = 10;

    constructor(data: IconData, callback: SVGIconCallback, color?: string) {
        super()
        let _blob = new Blob([ color ? data.raw.replace(/#ff+/g,color) : data.raw ], SVG_DESC);
        let _url = URL.createObjectURL(_blob);
        const _this = this;

        this.onload = () => {
            callback(_this, data.ratio);
            URL.revokeObjectURL(_url);
        };

        this.src = _url
    }
}
