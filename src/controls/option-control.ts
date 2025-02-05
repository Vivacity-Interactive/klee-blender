import { Canvas2D } from "../canvas";
import { Constants } from "../constants";
import { OptionProperty } from "../data/option/option-property";
import { Vector2 } from "../math/vector2";
import { ControlLayout, VerticalAlignment } from "./control";
import { HorizontalPanel } from "./horizontal-panel";
import { NodeControl } from "./nodes/node-control";
import { UserControl } from "./user-control";
import { LOT_USER_CONTROL, ValueType } from "./utils/user-utils";


export class OptionControl extends HorizontalPanel {

    private static readonly PIN_NAME_VALUED_PADDING_LEFT = 32
    private static readonly PIN_NAME_PADDING_LEFT = 12;
    private static readonly PIN_ICON_WIDTH = 10;
    private static readonly PINS_PADDING_HORIZONTAL = 0;
    private static readonly PINS_PADDING_LEFT_DEFAULT_BOX = 12;

    private _optionProperty: OptionProperty;
    private defaultValueBox: UserControl;

    private hidden: boolean;

    constructor(parentPosition: Vector2, option: OptionProperty) {
        super(0, 0);
        this._optionProperty = option;
        this.controlLayout |= ControlLayout.FillParentHorizontal;
        this.hidden = this._optionProperty.isHidden;//false;
        
        this.width = 0;
        this.height = Constants.DEFAULT_PROPERTY_HEIGHT;

        this.visible = !option.isHidden;
    }

    override initialize() {
        this.postInit();
    }

    get optionProperty(): OptionProperty {
        return this._optionProperty;
    }

    override set parent(value: UserControl) {
        this.controlParent = value;

        let nodeControl = this.findParent(NodeControl) as NodeControl;
        if (nodeControl) {
            // if (this.pinProperty.optionView == true && !nodeControl.showOptions && !this.pinProperty.isLinked) {
            //     this.visible = false;
            // }
        }
    }

    public postInit(): void {
        const _idType = this.optionProperty._type ?? this.optionProperty.type;
        const _BoxClass = this.optionProperty.isValued && LOT_USER_CONTROL[_idType];
        if (_BoxClass) {
            const _desc: ValueType = { type: _idType, unit: this.optionProperty.subCategory, min: 0, max: 1, decimal: 3 }
            const _panel = new HorizontalPanel();
            const _box = this.defaultValueBox = new _BoxClass(this.optionProperty.defaultValue, this.optionProperty.formattedName, _desc, this.optionProperty.id);
            const _paddingH = OptionControl.PINS_PADDING_HORIZONTAL + OptionControl.PINS_PADDING_LEFT_DEFAULT_BOX;
            const _paddingV = (Constants.DEFAULT_PROPERTY_HEIGHT - Constants.DEFAULT_BOX_HEIGHT)/2;
            _panel.padding.left = _panel.padding.right = _paddingH;
            _panel.padding.top = _panel.padding.bottom = _paddingV;
            _panel.height = Constants.DEFAULT_BOX_HEIGHT//Math.max(_box.height, _panel.height, Constants.DEFAULT_BOX_HEIGHT);
            _panel.height = Math.max(_box.height, _panel.height);
            _panel.controlLayout |= ControlLayout.FillParentVertical;
            _panel.childAlignment = VerticalAlignment.Top;

            _panel.add(_box);
            this.height = Math.max(_box.height, this.height, _panel.height);
            this.children.push(_panel);
        }
    }

    public setHidden(hidden: boolean) {
        this.hidden = hidden;
    }

    public onDraw(canvas: Canvas2D): void {

        if (this.hidden)
            return;

/// #if DEBUG_UI
        canvas.strokeStyle("#e0e");
        canvas.strokeRect(0, 0, this.size.x + this.padding.left + this.padding.right, this.size.y + this.padding.top + this.padding.bottom);
/// #endif

        canvas.save();

        let paddingX = this.padding.left;
        canvas.translate(paddingX, Math.floor(Constants.DEFAULT_PROPERTY_HEIGHT/2));

        this.drawOption(canvas);

        canvas.restore();
    }

    private drawOption(canvas: Canvas2D) {
        if (!this.defaultValueBox) {
            let textX = this.setupTextDrawing(canvas);
            canvas.fillText(this._optionProperty.formattedName, textX, 4);
        }
    }

    private setupTextDrawing(canvas: Canvas2D) : number {
        const padding = this._optionProperty.isValued ? OptionControl.PIN_NAME_VALUED_PADDING_LEFT : OptionControl.PIN_NAME_PADDING_LEFT;
        let textX = this.size.x - (OptionControl.PIN_NAME_PADDING_LEFT + OptionControl.PINS_PADDING_HORIZONTAL);

        canvas.textAlign("left")
        textX = OptionControl.PINS_PADDING_HORIZONTAL + padding;

        canvas.font('400 11px sans-serif')
        .fillStyle("#eee");

        return textX;
    }

    public formattedNameWidth(option: OptionProperty): number {
        return this.app.canvas.font(Constants.NODE_FONT).getContext().measureText(option.formattedName).width + OptionControl.PIN_NAME_PADDING_LEFT;
    }

    public getPinAbsolutePosition(): Vector2 {
        let position = this.getAbsolutPosition();
        position.y += this.height * 0.5;
        position.x += OptionControl.PINS_PADDING_HORIZONTAL;

        return position;
    }
}
