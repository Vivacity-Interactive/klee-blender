import { Canvas2D } from "../../canvas";
import { PropertyState, PropertyType } from "../../data/custom-property-enums";
import { IconCategory } from "../../data/icon-category";
import { PinShape } from "../../data/pin/pin-enums";
import { PinProperty } from "../../data/pin/pin-property";
import { IconData, LOT_ICONS } from "./icon-library";

const SVG_DESC = { type: 'image/svg+xml;charset=utf-8' };

type SVGIconCallback = (icon: SVGIcon) => void;

export class IconUtils {
    public static getIconDataPinState(pinProperty: PinProperty): IconData {
        return LOT_ICONS[LOT_PIN_ICON_STATE[(pinProperty.state & PropertyState.LINKED)]?.[pinProperty.shape] ?? pinProperty.shape];
    }

    public static getIconCategoryPinState(pinProperty: PinProperty): IconCategory | PinShape {
        return LOT_PIN_ICON_STATE[(pinProperty.state & PropertyState.LINKED)]?.[pinProperty.shape] ?? pinProperty.shape;
    }

    public static getIconDataPin(pinProperty: PinProperty): IconData {
        return LOT_ICONS[pinProperty.shape];
    }
}

export class SVGIcon extends Image {
    public pt: number = 10;
    public ratio: number = 1.0;
    public uid: string | number = null;
    private _queue: Map<string|number, SVGIconCallback> = new Map();
    private static _cache: Map<string|number, SVGIcon> = new Map();

    constructor(data: IconData, _uid: string | number, fill?: string, stroke?: string, lineWidth?: number) {
        super()
        let _ref = SVGIcon._cache.get(_uid);
        if(!_ref) {
            SVGIcon._cache.set(_uid, this)
            _ref = this;
            let _blob = new Blob([ fill ? data.raw.replace(/#ff+/g,fill) : data.raw ], SVG_DESC);
            let _url = URL.createObjectURL(_blob);
            this.ratio = data.ratio;
            this.uid = _uid;
            
            const _this = this;
            _this.onload = () => {
                _this.execute();
                URL.revokeObjectURL(_url);
            };

            this.src = _url;
        }
        return _ref;
    }

    public execute() {
        for (const [id, exec] of this._queue) { exec(this); }
        this._queue.clear();
    }

    public queue(id:any, callback: SVGIconCallback, canvas: Canvas2D) {
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

export const LOT_PIN_ICON_STATE: Partial<{ [key in PropertyState]: { [key in PinShape]: PinShape } }> = {
    [PropertyState.LINKED]: {
        [PinShape.CIRCLE]: PinShape.CIRCLE,
        [PinShape.SQUARE]: PinShape.SQUARE,
        [PinShape.DIAMOND]: PinShape.DIAMOND,
        [PinShape.CIRCLE_DOT]: PinShape.CIRCLE,
        [PinShape.SQUARE_DOT]: PinShape.SQUARE,
        [PinShape.DIAMOND_DOT]: PinShape.DIAMOND
    }
}

export const LOT_DATA_ICON: Partial<{ [key in PropertyType]: IconCategory }> = {
    [PropertyType.OBJECT]: IconCategory.OBJECT_DATA,
    [PropertyType.TEXTURE]: IconCategory.TEXTURE_DATA,
    [PropertyType.IMAGE]: IconCategory.IMAGE_DATA,
    [PropertyType.COLLECTION]: IconCategory.GROUP,
    [PropertyType.MATERIAL]: IconCategory.MATERIAL_DATA
}