import { Canvas2D } from "../canvas";
import { Constants } from "../constants";
import { UserControl } from "./user-control";
import { IconLibrary } from "./utils/icon-library";

export class CheckBoxControl extends UserControl {

    private isTrue: boolean;

    constructor(isTrue: boolean) {
        super();
        this.isTrue = isTrue;
        this.width = Constants.DEFAULT_BOX_HEIGHT;
        this.height = Constants.DEFAULT_BOX_HEIGHT;
        this.padding.top = 1;
        this.padding.bottom = 1;
    }

    protected onDraw(canvas: Canvas2D) {
        const icon = new Path2D(IconLibrary.DEFAULT_VALUE_BOOL_TRUE);

        canvas  // Draws background box
            .roundedRectangle(0, 0 - Constants.DEFAULT_BOX_HEIGHT / 2, Constants.DEFAULT_BOX_HEIGHT -1, Constants.DEFAULT_BOX_HEIGHT-1, Constants.DEFAULT_BOX_RADIUS)
            .fillStyle(this.isTrue ? '#4772b3ff' : '#545454ff')
            .fill()

        canvas  // Draws stroke
            .strokeStyle('#3d3d3dff')
            .lineWidth(1)
            .stroke();

        if(this.isTrue) {
            canvas
                .fillStyle(Constants.NODE_TEXT_COLOR)
                .translate(-0.5, - Constants.DEFAULT_BOX_HEIGHT / 2)
                .fill(icon, 'evenodd');
        }
    }
}
