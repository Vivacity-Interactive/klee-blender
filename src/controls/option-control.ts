import { Canvas2D } from "../canvas";
import { Constants } from "../constants";
import { OptionProperty } from "../data/option/option";
import { Vector2 } from "../math/vector2";
import { NodeControl } from "./nodes/node-control";
import { UserControl } from "./user-control";
import { LOT_USER_CONTROL } from "./utils/user-utils";


export class OptionControl extends UserControl {

    private static readonly PIN_NAME_PADDING_LEFT = 14;
    private static readonly PIN_ICON_WIDTH = 10;
    private static readonly PINS_PADDING_HORIZONTAL = 0;
    private static readonly PINS_PADDING_LEFT_DEFAULT_BOX = 8;

    private _optionProperty: OptionProperty;
    private defaultValueBox: UserControl;

    private hidden: boolean;

    constructor(parentPosition: Vector2, option: OptionProperty) {
        super(0, 0);
        this._optionProperty = option;
        this.hidden = false;
        
        this.width = 0;
        this.height = 27;

        this.visible = !option.isHidden;
    }

    override initialize() {
        if (this.visible) {
            if (!this.optionProperty.isHidden && !this.optionProperty.isNameless) {
                this.width = this.formattedNameWidth(this.optionProperty) + OptionControl.PINS_PADDING_HORIZONTAL + OptionControl.PIN_ICON_WIDTH;
            } else if (!this.optionProperty.isHidden) {
                this.width = OptionControl.PINS_PADDING_HORIZONTAL + OptionControl.PIN_ICON_WIDTH;
            }
        }

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
        const box = this.optionProperty.isValued && LOT_USER_CONTROL[this.optionProperty.type];
        if (box) {
            this.defaultValueBox = new box(this.optionProperty.defaultValue);
            this.defaultValueBox.initControl(this.app);
            this.defaultValueBox.position.x = this.formattedNameWidth(this._optionProperty) + OptionControl.PINS_PADDING_HORIZONTAL + OptionControl.PINS_PADDING_LEFT_DEFAULT_BOX;
            this.defaultValueBox.padding.right = OptionControl.PINS_PADDING_LEFT_DEFAULT_BOX;
            this.defaultValueBox.padding.left = OptionControl.PINS_PADDING_LEFT_DEFAULT_BOX;
            this.width += this.defaultValueBox.width + this.defaultValueBox.padding.left + this.defaultValueBox.padding.right;
            this.height += this.defaultValueBox.padding.top + this.defaultValueBox.padding.bottom;
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
        canvas.translate(paddingX, Math.floor(this.height * 0.5));

        this.drawOption(canvas);

        canvas.restore();
    }

    private drawOption(canvas: Canvas2D) {
        let textX = this.setupTextDrawing(canvas);

        canvas.fillText(this._optionProperty.formattedName, textX, 4);    

        if (this.defaultValueBox) {
            this.drawDefaultValueBox(canvas);
        }
    }

    private drawDefaultValueBox(canvas: Canvas2D) {
        if(this.defaultValueBox) {
            this.defaultValueBox.draw(canvas);
        }
    }

    private setupTextDrawing(canvas: Canvas2D) : number {
        let textX = this.size.x - (OptionControl.PIN_NAME_PADDING_LEFT + OptionControl.PINS_PADDING_HORIZONTAL);

        canvas.textAlign("left")
        textX = OptionControl.PIN_NAME_PADDING_LEFT + OptionControl.PINS_PADDING_HORIZONTAL;

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
