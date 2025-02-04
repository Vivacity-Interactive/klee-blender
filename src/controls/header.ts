import { Canvas2D } from "../canvas";
import { Node } from "../data/nodes/node";
import { Constants } from "../constants";
import { VerticalPanel } from "./vertical-panel";
import { HorizontalPanel } from "./horizontal-panel";
import { Icon } from "./icon";
import { Label } from "./label";
import { PinControl } from "./pin-control";
import { ColorUtils } from "./utils/color-utils";
import { ControlLayout } from "./control";


export class Header extends HorizontalPanel {

    private static readonly HEADER_TITLE_HEIGHT = 23;
    private static readonly NODE_DEFAULT_BACKGROUND_COLOR = '78, 117, 142'; //#CCCC00

    private fillStyleHeader: string;
    protected headerHeight = Header.HEADER_TITLE_HEIGHT;
    private icon: Icon = undefined;
    private node: Node;

    private titlePanel: VerticalPanel;
    private delegatePanel: VerticalPanel;

    constructor(node: Node, icon?: string) {
        super();

        this.node = node;
        this.padding = { top: 2, right: 0, bottom: 0, left: 7 }

        if (icon) {
            this.icon = new Icon(icon);
            this.add(this.icon);
        }

        this.titlePanel = new VerticalPanel();
        this.titlePanel.padding = { top: 0, right: 0, bottom: 0, left: 0 };

        let title = new Label(node.title, Constants.NODE_HEADER_FONT);
        title.color = Constants.NODE_TEXT_COLOR;
        title.padding = { top: 6, right: 0, bottom: 3, left: 0 };
        this.titlePanel.add(title);

        this.add(this.titlePanel);

        this.delegatePanel = new VerticalPanel();
        this.delegatePanel.controlLayout |= ControlLayout.FillParentHorizontal;
        this.delegatePanel.minWidth = 28;
        this.add(this.delegatePanel);
    }

    override initialize() {
        this.fillStyleHeader = ColorUtils.getNodeColor(this.node);//.resolveNodeColor(this.node);
    }

    protected onDraw(canvas: Canvas2D) {
        canvas.fillStyle(this.fillStyleHeader)
            .roundedRectangle(1, 1, this.size.x - 2, this.size.y, { radiusTopLeft: 5, radiusTopRight: 5, radiusBottomLeft: 0, radiusBottomRight: 0 })
            .fill()
            .clip() // todo needs fix
    }

    public addDelegate(pinControl: PinControl) {
        this.delegatePanel.add(pinControl);
    }
}
