import { Canvas2D } from "../../canvas";
import { IconData } from "./icon-library";

const SVG_DESC = { type: 'image/svg+xml;charset=utf-8' };

type SVGIconCallback = (icon: SVGIcon) => void;

export class SVGIcon extends Image {
    public pt: number = 10;
    public ratio: number = 1.0;
    private _queue: Map<string|number, SVGIconCallback> = new Map();

    constructor(data: IconData, callback?: SVGIconCallback, fill?: string, stroke?: string, lineWidth?: number) {
        super()
        let _blob = new Blob([ fill ? data.raw.replace(/#ff+/g,fill) : data.raw ], SVG_DESC);
        let _url = URL.createObjectURL(_blob);
        this.ratio = data.ratio;
        const _this = this;

        this.queue(callback);

        this.onload = () => {
            _this.execute();
            URL.revokeObjectURL(_url);
        };

        this.src = _url;
    }

    public execute() {
        for (const [id, exec] of this._queue) { exec(this); }
        this._queue.clear();
    }

    public queue(callback: SVGIconCallback, canvas?: Canvas2D) {
        this.queueId(callback, callback, canvas);
    }

    public queueId(id:any, callback: SVGIconCallback, canvas: Canvas2D) {
        const bQueue = !this.complete && callback && true;
        if (bQueue) { this._queue.set(id ?? callback, _DDxIcon(canvas, callback)); }
        else if (callback) { callback(this); }
    }
}

export function _DDxIcon(canvas: Canvas2D, callback: SVGIconCallback): SVGIconCallback {
    const context = canvas.getContext();
    const transform = context.getTransform();
    return (icon: SVGIcon) => {
        canvas.save();
        context.setTransform(transform);
        callback(icon);
        canvas.restore();
    }
}