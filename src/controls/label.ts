import { Application } from "../application";
import { Canvas2D } from "../canvas";
import { Constants } from "../constants";
import { Vector2 } from "../math/vector2";
import { UserControl } from "./user-control";

export enum TextAlignment {
    None = 0,
    Top = 1 << 0,
    Middle = 1 << 1,
    Bottom = 1 << 2,
    Left = 1 << 3,
    Center = 1 << 4,
    Right = 1 << 5
}

export enum TextVerticalAlignment {
    None,
    Top,
    Middle,
    Bottom,
}

export class Label extends UserControl {

    public font: string;
    public textVerticalAlign: TextVerticalAlignment = TextVerticalAlignment.Middle;
    public textAlign: CanvasTextAlign;
    public color: string;
    public text: string;
    public baseLine: number;

    constructor(text: string, font?: string, color?: string) {
        super();

        this.text = text;
        this.font = (font || Constants.NODE_FONT);
        this.color = (color || Constants.NODE_TEXT_COLOR);

        this.padding = { top: 0, right: 0, bottom: 0, left: 0 }
    }

    override initialize() {
        let textMetrics = this.measureText();
        //this.minWidth = textMetrics.width;
        this.minHeight = textMetrics.fontBoundingBoxAscent + textMetrics.fontBoundingBoxDescent;
        if (isNaN(this.minHeight)) {
            textMetrics = this.measureText("|_");
            this.minHeight = textMetrics.actualBoundingBoxAscent + textMetrics.actualBoundingBoxDescent + 5;
        }
        this.baseLine = Math.floor(this.minHeight / 3);
    }

    protected onDraw(canvas: Canvas2D) {
/// #if DEBUG_UI
        canvas.strokeStyle("#0e0")
        .strokeRect(0, 0, this.size.x + this.padding.left + this.padding.right, this.size.y + this.padding.top + this.padding.bottom);
/// #endif
        let position = this.getPosition();
        //this.size.x - this.padding.right
        canvas
            .roundedRectangle(this.padding.left, this.padding.top, this.size.x - this.padding.right, this.size.y - this.padding.bottom, Constants.DEFAULT_BOX_RADIUS)
            //.clip()
            .font(this.font)
            .textAlign(this.textAlign)
            .fillStyle(this.color)
            .fillText(this.text, position.x, position.y);
    }

    private measureText(text?: string): TextMetrics {
        return this.app.canvas.font(this.font).getContext().measureText((text || this.text));
    }

    private getPosition(): Vector2 {
        let position = new Vector2(0, 0);
        
        position.x = this.padding.left;
        position.y = this.padding.top;
        if (this.textVerticalAlign == TextVerticalAlignment.Top) {
            position.y = this.padding.top + this.baseLine;
        } else if (this.textVerticalAlign == TextVerticalAlignment.Bottom) {
            position.y = this.size.y + this.padding.top - this.baseLine;
        } else  if (this.textVerticalAlign == TextVerticalAlignment.Middle) {
            position.y = this.padding.top + this.size.y/2 + this.baseLine/2;
        }

        if(this.textAlign == 'right') { position.x = this.size.x - this.minWidth - this.padding.right; }
        else if (this.textAlign == 'center') { position.x = this.size.x * 0.5; }      

        return position;
    }

}