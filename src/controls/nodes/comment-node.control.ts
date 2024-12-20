import { Canvas2D } from "../../canvas";
import { Constants } from "../../constants";
import { Color } from "../../data/color";
import { CommentNode } from "../../data/nodes/comment.node";
import { Vector2 } from "../../math/vector2";
import { DrawableControl } from "../interfaces/drawable";
import { NodeControl } from "./node.control";

export class CommentNodeControl extends NodeControl implements DrawableControl {

    private static readonly _HEADER_TEXT_COLOR = "#eeeeee";
    private static readonly _DEFAULT_COMMENT_COLOR = "#eeeeee";

    private headerBackgroundColor: string;
    private bodyBackgroundColor: string;

    constructor(node: CommentNode) {
        super(node);

        this.zIndex = -100;
        this.width = node.width;
        this.height = node.height;

        this.applyCommentColor(node.backgroundColor);
    }

    public onDraw(canvas: Canvas2D) {

        canvas.fillStyle(this.bodyBackgroundColor)
            .font(Constants.NODE_FONT)
            .roundedRectangle(0, 0, this.width, this.height, 5)
            .fill()

        this.drawTitle(canvas);

        canvas.roundedRectangle(0, 0, this.width, this.height, 5);

        this.drawStroke(canvas);
    }

    private applyCommentColor(nodeColor: string) {
        if (nodeColor == undefined || nodeColor == '')
            nodeColor = CommentNodeControl._DEFAULT_COMMENT_COLOR;

        let color = new Color(nodeColor);

        color.applyGamma();
        color.A = color.A * 0.3;
        this.bodyBackgroundColor = color.toRGBAString();
        color.darken(0.3);
        this.headerBackgroundColor = color.toRGBString();
    }

    private drawTitle(canvas: Canvas2D) {

        const textPosition = new Vector2(9, 23);
        const headerHeight = 32;

        canvas.fillStyle(this.headerBackgroundColor)
            .roundedRectangle(0, 0, this.width, headerHeight, { radiusTopLeft: 5, radiusTopRight: 5, radiusBottomLeft: 0, radiusBottomRight: 0 })
            .fill()
            .font("400 11px sans-serif")
            .textAlign('left')
            .strokeStyle('#333')
            .lineWidth(1.5)
            .strokeText(this.node.title, textPosition.x + 1, textPosition.y + 1)
            .fillStyle(CommentNodeControl._HEADER_TEXT_COLOR)
            .fillText(this.node.title, textPosition.x, textPosition.y)
    }
}
