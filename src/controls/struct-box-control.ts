import { Canvas2D } from "../canvas";
import { Constants } from "../constants";
import { ControlLayout } from "./control";
import { HorizontalPanel } from "./horizontal-panel";
import { Label } from "./label";
import { UserControl } from "./user-control";
import { ValueBoxControl } from "./value-box-control";
import { VerticalPanel } from "./vertical-panel";


export class StructBoxControl extends VerticalPanel {

    private entries: Array<{ key: string, value: any }>;//Array<{ key: string, value: any }>;
    private title: string;

    constructor(entries:Array<{ key: string, value: any }>, title: string = "") {
        super();
        this.title = title;
        this.height = Constants.DEFAULT_BOX_HEIGHT;
        this.entries = entries;
        this.controlLayout |= ControlLayout.FillParentHorizontal;

        const _label = new Label(this.title, Constants.NODE_FONT, "#cccccc");
        _label.height = Math.max(Constants.DEFAULT_BOX_HEIGHT, Constants.DEFAULT_PROPERTY_HEIGHT - 6);
        //_label.padding = .padding = { top: 6, right: 0, bottom: 3, left: 0 };
        //_label.controlLayout |= ControlLayout.IgnoreHorizontal;
        this.children.push(_label);

        let _height = _label.height;
        let index = 0;
        for (const entry of this.entries) {
            const _panel = new HorizontalPanel();
            const _box = new ValueBoxControl(entry.value, entry.key);
            _box.height = Constants.DEFAULT_BOX_HEIGHT;
            _panel.height = Constants.DEFAULT_BOX_HEIGHT//Math.max(_box.height, _panel.height, Constants.DEFAULT_BOX_HEIGHT);
            _panel.height = Math.max(_box.height, _panel.height, Constants.DEFAULT_PROPERTY_HEIGHT - 6);
            _panel.controlLayout |= ControlLayout.FillParentVertical;
            _panel.add(_box);
            _height += Math.max(Constants.DEFAULT_BOX_HEIGHT, _panel.height);
            index++;
            this.children.push(_panel);
        }

        _height += Constants.DEFAULT_VALUE_BOX_MARGIN_LEFT;
        
        this.height = Math.max(this.height, _height);
        
    }

    override initialize() {
        this.position.y = this.size.y/2;
    }

    protected onDraw(canvas: Canvas2D) {
        /// #if DEBUG_UI
        canvas.strokeStyle("#8D4BBB");
        canvas.strokeRect(0, 0, this.size.x + this.padding.left + this.padding.right, this.size.y + this.padding.top + this.padding.bottom);
        /// #endif
        
        // canvas.save();
        // canvas
        //     .roundedRectangle(0, 0, this.size.x, this.size.y, Constants.DEFAULT_BOX_RADIUS)
        //     .clip();
        // canvas.restore();
        // canvas.roundedRectangle(0, 0, this.size.x, this.size.y, Constants.DEFAULT_BOX_RADIUS)
        //     .clip()
        //     .font(Constants.NODE_FONT)
        //     .fillStyle("#cccccc")
        //     .textAlign("left")
        //     .fillText(this.title, Constants.DEFAULT_VALUE_BOX_TEXT_PADDING, Constants.DEFAULT_VALUE_BOX_TEXT_PADDING + this.size.y/2);
    }
}
