import { Canvas2D } from "../canvas";
import { Node } from "../data/nodes/node";
import { Application } from "../application";
import { Constants } from "../constants";
import { Container } from "./container";
import { Vector2 } from "../math/vector2";
import { HorizontalAlignment, VerticalPanel } from "./vertical-panel";
import { HorizontalPanel } from "./horizontal-panel";
import { Icon } from "./icon";
import { Label } from "./label";
import { PinControl } from "./pin.control";


export class Header extends HorizontalPanel {

    private static readonly HEADER_TITLE_HEIGHT = 23;
    private static readonly NODE_DEFAULT_BACKGROUND_COLOR = '78, 117, 142'; //#CCCC00

    private fillStyleHeader: CanvasGradient;
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

        let subTitles = this.node.subTitles.sort((a, b) => (b.orderIndex || 0) - (a.orderIndex || 0))
        for (const subTitle of subTitles) {
            let label = new Label(subTitle.text, Constants.NODE_FONT, Constants.NODE_SUBTITLE_COLOR)
            this.titlePanel.add(label);
        }

        this.add(this.titlePanel);

        this.delegatePanel = new VerticalPanel();
        this.delegatePanel.fillParentHorizontal = true;
        this.delegatePanel.minWidth = 28;
        this.add(this.delegatePanel);
    }

    override initialize() {
        this.fillStyleHeader = this.getHeaderFillStyle();
    }

    protected onDraw(canvas: Canvas2D) {
        canvas.fillStyle(this.fillStyleHeader)
            .roundedRectangle(1, 1, this.size.x - 2, this.size.y, { radiusTopLeft: 5, radiusTopRight: 5, radiusBottomLeft: 0, radiusBottomRight: 0 })
            .fill();
    }

    private getHeaderFillStyle(): CanvasGradient {
        const backgroundColor = this.node.backgroundColor || Header.NODE_DEFAULT_BACKGROUND_COLOR;
        //const gradient = this.app.canvas.fillStyle(`rgb(${backgroundColor})`);
        const gradient = this.app.canvas.getContext().createLinearGradient(0, 0, 150, 0);
        gradient.addColorStop(0, `rgba(${backgroundColor},0.5)`);
        gradient.addColorStop(1, `rgba(${backgroundColor},0.5)`);
        return gradient;
    }

    public addDelegate(pinControl: PinControl) {
        this.delegatePanel.add(pinControl);
    }
}
