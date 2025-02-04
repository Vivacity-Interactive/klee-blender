import { Canvas2D } from "../canvas";
import { Constants } from "../constants";
import { PropertyType } from "../data/custom-property-enums";
import { ControlLayout } from "./control";
import { HorizontalPanel } from "./horizontal-panel";
import { Label } from "./label";
import { UserControl } from "./user-control";
import { CustomDataType } from "./utils/icon-utils";
import { ValueType } from "./utils/user-utils";
import { ValueBoxControl } from "./value-box-control";
import { VerticalPanel } from "./vertical-panel";


export class StructBoxControl extends VerticalPanel {

    private entries: Array<{ key: string, value: any }>;//Array<{ key: string, value: any }>;
    private title: string;
    private desc: ValueType;

    constructor(entries:Array<{ key: string, value: any }>, title: string = "", desc: ValueType = null, _uid: number | string = null) {
        super();
        this.desc = desc;
        this.title = title;
        this.height = Constants.DEFAULT_BOX_HEIGHT;
        this.entries = entries;
        this.controlLayout |= ControlLayout.FillParentHorizontal;

        const _label = new Label(this.title, Constants.NODE_FONT, "#cccccc");
        _label.height = Math.max(Constants.DEFAULT_BOX_HEIGHT, Constants.DEFAULT_PROPERTY_HEIGHT - 6);
        this.children.push(_label);

        let _height = _label.height;
        let index = 0;
        for (const entry of this.entries) {
            const _panel = new HorizontalPanel();
            const _box = new ValueBoxControl(entry.value, entry.key, desc, _uid);
            _box.height = Constants.DEFAULT_BOX_HEIGHT;
            _panel.height = Constants.DEFAULT_BOX_HEIGHT;
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
    }
}
