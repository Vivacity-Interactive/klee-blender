import { Canvas2D } from "../../canvas";
import { DrawableControl } from "../interfaces/drawable";
import { NodeControl } from "./node-control";
import { Node } from "../../data/nodes/node";
import { PinProperty } from "../../data/pin/pin-property";
import { PinControl } from "../pin-control";
import { ColorUtils } from "../utils/color-utils";
import { SVGIcon } from "../utils/icon-utils";


export class RerouteNodeControl extends NodeControl implements DrawableControl {

    constructor(node: Node) {
        super(node);
        this.width = 16;
        this.height = 16;

        this._stroke.lineWidth = 0.5;
        this.drawChildren = false;
        this.mainPanel.width = 0;

        this.createProperties();
    }

    protected override onPinCreated(pin: PinControl) {
        pin.ignoreLayout = true;
        this.mainPanel.add(pin);
        pin.position.y = 8;
        pin.position.x = 8;
        pin.width = 0;
        pin.height = 0;
        pin.visible = false;
    }

    onDraw(canvas: Canvas2D) {
        const icon = this.pins[0].icon;

        const _this = this;
        const _fx = (icon: SVGIcon) => {
            const _scale = _this.pins[0].iconScale;
            // Todo find where 2 comes from
            canvas.drawImage(icon, 0, 2, _scale, icon.ratio * _scale);
        }
        
        if (icon) { icon.queueId(this.node.id, _fx, canvas); }
    }
}
