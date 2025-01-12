import { Canvas2D } from "../canvas";
import { Constants } from "../constants";
import { IconCategory } from "../data/icon-category";
import { UserControl } from "./user-control";
import { LOT_ICONS } from "./utils/icon-library";
import { SVGIcon } from "./utils/icon-utils";

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
        //const icon = new Path2D(IconLibrary.DEFAULT_VALUE_BOOL_TRUE);

        canvas  // Draws background box
            .roundedRectangle(0, 0 - Constants.DEFAULT_BOX_HEIGHT / 2, Constants.DEFAULT_BOX_HEIGHT -1, Constants.DEFAULT_BOX_HEIGHT-1, Constants.DEFAULT_BOX_RADIUS)
            .fillStyle(this.isTrue ? '#4772b3ff' : '#545454ff')
            .fill()

        canvas  // Draws stroke
            .strokeStyle('#3d3d3dff')
            .lineWidth(1)
            .stroke();

        if(this.isTrue) {
            const data = LOT_ICONS[IconCategory.CHECKBOX_HLT];
            
            const check = new SVGIcon(data,(icon) => {
                const _scale = Constants.DEFAULT_BOX_HEIGHT;
                
                canvas
                    .fillStyle(Constants.NODE_TEXT_COLOR)
                    .drawImage(icon, 0, 0, _scale, icon.ratio * _scale);

            }, '#4772b3ff');
            
            // canvas
            //     .fillStyle(Constants.NODE_TEXT_COLOR)
            //     .translate(-0.5, - Constants.DEFAULT_BOX_HEIGHT / 2)
            //     .fill(icon, 'evenodd');
        }
    }
}
