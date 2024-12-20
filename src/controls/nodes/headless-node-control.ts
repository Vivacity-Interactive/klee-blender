import { Canvas2D } from "../../canvas";
import { NodeControl } from "./node.control";
import { Vector2 } from "../../math/vector2";
import { Node } from "../../data/nodes/node";
import { Constants } from "../../constants";
import { HorizontalSpacerControl } from "../horizontal-spacer.control";


export class HeadlessNodeControl extends NodeControl {

    private static readonly _NODE_BACKGROUND_COLOR = "#3d3d3dff";

    constructor(node: Node) {
        super(node);

        this.minHeight = 32;
        this.padding = { top: 2, right: 0, bottom: 0, left: 0 };

        this.createPins(new Vector2(0, 0));
    }

    override initialize() {
        if(this.node.title) {
            const textWidth = this.measureText(Constants.NODE_MATHFUNC_TITLE_FONT, this.node.title).width + 32;
            const spacer = new HorizontalSpacerControl(textWidth);
            spacer.fillParentVertical = true;
            this.pinPanel.insert(spacer, 1);
        }
    }

    public onDraw(canvas: Canvas2D) {
        canvas.fillStyle(HeadlessNodeControl._NODE_BACKGROUND_COLOR)
            .roundedRectangle(0, 0, this.size.x, this.size.y, 16)
            .fill()

        this.drawTitle(canvas);
        this.drawFirstSubTitle(canvas);
        this.drawStroke(canvas);
    }

    protected drawTitle(canvas: Canvas2D) {
        if(!this.node.title) { return; }

        canvas
            .font(Constants.NODE_MATHFUNC_TITLE_FONT)
            .textAlign('center')
            .fillStyle(Constants.NODE_MATHFUNC_TITLE_COLOR)
            .fillText(this.node.title, this.size.x * 0.5, this.size.y * 0.5 + 8);
    }


    protected drawFirstSubTitle(canvas: Canvas2D) {
        if(!this.node.subTitles || this.node.subTitles.length === 0) { return; }

        canvas
            .font(Constants.NODE_MATHFUNC_SUBTITLE_FONT)
            .textAlign('center')
            .fillStyle(Constants.NODE_MATHFUNC_TITLE_COLOR)
            .fillText(this.node.subTitles[0].text, this.size.x * 0.5, this.size.y * 0.5 + 22);
    }

    private measureText(font: string, text: string): TextMetrics {
        return this.app.canvas.font(font).getContext().measureText(text);
    }
}
