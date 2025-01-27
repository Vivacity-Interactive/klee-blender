import { Canvas2D } from "../canvas";
import { Constants } from "../constants";
import { IconCategory } from "../data/icon-category";
import { ControlLayout } from "./control";
import { UserControl } from "./user-control";
import { LOT_ICONS } from "./utils/icon-library";
import { SVGIcon } from "./utils/icon-utils";

export class CheckBoxControl extends UserControl {

    private isTrue: boolean;
    private title: string;

    constructor(isTrue: boolean, title: string = "") {
        super();
        this.title = title;
        this.isTrue = isTrue;
        //this.width = Constants.DEFAULT_BOX_HEIGHT;
        this.height = Constants.DEFAULT_BOX_HEIGHT;
        this.controlLayout |= ControlLayout.FillParentHorizontal | ControlLayout.IgnoreVertical;
    }

    protected onDraw(canvas: Canvas2D) {
        //const icon = new Path2D(IconLibrary.DEFAULT_VALUE_BOOL_TRUE);
/// #if DEBUG_UI
        canvas.strokeStyle("#0FF");
        canvas.strokeRect(0, 0, this.size.x + this.padding.left + this.padding.right, this.size.y + this.padding.top + this.padding.bottom);
/// #endif
        canvas.save();
        canvas  // Draws background box
            .roundedRectangle(0, 0, Constants.DEFAULT_BOX_HEIGHT, Constants.DEFAULT_BOX_HEIGHT, Constants.DEFAULT_BOX_RADIUS)
            .fillStyle(this.isTrue ? '#4772b3ff' : '#545454ff')
            .fill()

        canvas  // Draws stroke
            .strokeStyle('#3d3d3dff')
            .lineWidth(1)
            .stroke();

        // if(this.isTrue) {
        //     const data = LOT_ICONS[IconCategory.CHECKBOX_HLT];
            
        //     // const check = new SVGIcon(data,(icon) => {
        //     //     const _scale = Constants.DEFAULT_BOX_HEIGHT;
                
        //     //     canvas
        //     //         .fillStyle(Constants.NODE_TEXT_COLOR)
        //     //         .drawImage(icon, this.padding.left, this.padding.right, _scale, icon.ratio * _scale);

        //     // }, '#4772b3ff');
            
        //     // canvas
        //     //     .fillStyle(Constants.NODE_TEXT_COLOR)
        //     //     .translate(-0.5, - Constants.DEFAULT_BOX_HEIGHT / 2)
        //     //     .fill(icon, 'evenodd');
        // }

        canvas.restore();
        canvas.roundedRectangle(0, 0, this.size.x, this.size.y, Constants.DEFAULT_BOX_RADIUS)
            .clip()
            .font(Constants.NODE_FONT)
            .fillStyle('#cccccc')
            .textAlign("left")
            .fillText(this.title, Constants.DEFAULT_VALUE_BOX_TITLE_PADDING, Constants.DEFAULT_VALUE_BOX_TEXT_PADDING + this.size.y/2);
    }
}
