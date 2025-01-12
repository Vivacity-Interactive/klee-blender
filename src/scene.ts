import { Camera } from "./camera";
import { Canvas2D } from "./canvas";
import { Background } from "./controls/background";
import { Control } from "./controls/control";
import { DrawableControl, isDrawableControl } from "./controls/interfaces/drawable";
import { NodeConnectionControl } from "./controls/node-connection-control";
import { NodeControl } from "./controls/nodes/node-control";
import { Vector2 } from "./math/vector2";
import { PinDirection } from "./data/pin/pin-direction";
import { NodePartialConnectionControl } from "./controls/partial-node-connection-control";
import { PinControl } from "./controls/pin-control";
import { UserControl } from "./controls/user-control";
import { Node } from "./data/nodes/node";
import { Container } from "./controls/container";
import { InteractableControl, isInteractableControl } from "./controls/interfaces/interactable";
import { InteractableUserControl } from "./controls/interactable-user-control";
import { Application } from "./application";
import { Graph } from "./data/graph";
import { HeadedNodeControl } from "./controls/nodes/headed-node-control";
import { PinLink } from "./data/pin/pin-link";
import { PinState } from "./data/pin/pin-property";
import { NodeUtils } from "./controls/utils/node-utils";

export class Scene {

    private _canvas: Canvas2D;
    private _camera: Camera;

    private _graph: Graph;

    private _controls: Array<Control>;
    private _nodes: Array<NodeControl>;
    private _pins: Array<PinControl>;
    private _links: Array<NodeConnectionControl|NodePartialConnectionControl>;
    private _interactables: Array<InteractableUserControl>;

    private app;

    constructor(canvas: Canvas2D, app: Application) {
        this.app = app;
        this._canvas = canvas;
        this._camera = new Camera(this._canvas);
        this._nodes = new Array<NodeControl>();
        this._controls = new Array<Control>();
        this._pins = new Array<PinControl>();
        this._canvas['__CAMERA__'] = this._camera;
    }

    // TODO: Move this out
    get camera() {
        return this._camera;
    }

    get canvas() {
        return this._canvas;
    }

    get nodes() {
        return this._nodes || [];
    }

    get links() {
        return this._links || [];
    }

    get interactables() {
        return this._interactables || [];
    }

    collectInteractables() {
        let interactables: Array<InteractableUserControl> = [];
        this._controls.forEach((control) => {
            if (control instanceof InteractableUserControl) {
                interactables.push(control);
            }
            
            if (control instanceof Container) {
                this.findInteractablesIn(interactables, control);
            }
        });

        this._interactables = interactables;
    }

    private findInteractablesIn(interactables: Array<InteractableUserControl>, container: Container) {

        for (let child of container.getChildren()) {
            if (child instanceof InteractableUserControl) {
                interactables.push(child);
            }

            if (child instanceof Container) {
                this.findInteractablesIn(interactables, child);
            }
        }
    }

    updateLayout() {
        this._controls.forEach((control) => {
            if (control instanceof UserControl) {
                (control as UserControl).refreshLayout();
            }
        });
    }

    refresh() {
        this._canvas.clear();

        this._controls.sort((a, b) => {
            return a.ZIndex - b.ZIndex;
        });

        this._camera.prepareViewport();
        this._controls.forEach((control) => {
            if (isDrawableControl(control)) {
                (control as DrawableControl).draw(this._canvas);
            }
        });
    }

    unload() {
        this._pins = new Array<PinControl>();
        this._nodes = new Array<NodeControl>();
        this._controls = new Array<Control>();
    }

    load(dataGraph: Graph) {
        this._graph = dataGraph;
        this.createBackground();
        this.createControlNodes(this._graph.nodes);

        this.createConnectionLines(this._graph.links);

        this.initializeControls();
    }

    private createBackground() {
        let background = new Background(this.camera);
        this._controls.push(background);
    }

    private createControlNodes(nodes: Node[]) {
        for (const node of nodes) {
            const _cls = NodeUtils.getNodeControl(node.class) ?? HeadedNodeControl;
            let control = new _cls(node);
            this._nodes.push(control);
            this._controls.push(control);

            this.collectPins(control);
        }
    }

    private collectPins(control: Control) {
        if (control instanceof Container) {
            for (let child of control.getChildren()) {
                if (child instanceof PinControl) {
                    this._pins.push(child);
                }
                if (child instanceof Container) {
                    this.collectPins(child);
                }
            }
        }
    }

    private createConnectionLines(links: PinLink[]) {
        for (const link of links) {
            let _from = this._pins.find(p => {
                const bLinked = p.pinProperty.id == link.fromPinID;
                if (bLinked) { p.pinProperty.state |= PinState.LINKED; }
                return bLinked;
            });
            let _to = this._pins.find(p => {
                const bLinked = p.pinProperty.id == link.toPinID;
                if (bLinked) { p.pinProperty.state |= PinState.LINKED; }
                return bLinked;
            });
            let control = (_to && _from) 
                ? new NodeConnectionControl(_from, _to)
                : new NodePartialConnectionControl(_from || _to);

            this.links.push(control);    
            this._controls.push(control);
        }
    }

    private initializeControls() {
        for (let control of this._controls) {
            this.initializeControl(control);
        }        
    }

    private initializeControl(control: Control) {
        control.initControl(this.app);

        if (control instanceof Container) {
            for (let child of control.getChildren()) {
                this.initializeControl(child);
            }
        }
    }

    calculateCentroid(): Vector2 {
        let centroid = new Vector2(0, 0);
 
        if (this.nodes.length == 0)
            return centroid;

        this.nodes.forEach(node => {
            centroid = new Vector2(
                centroid.x - node.position.x - (node.size.x * 0.5),
                centroid.y - node.position.y - (node.size.y * 0.5));
        });

        return new Vector2(centroid.x / this.nodes.length, centroid.y / this.nodes.length);
    }

    calculateCenterPoint() {
        if (this.nodes.length == 0)
            return new Vector2(0, 0);

        let xMin = Number.MAX_SAFE_INTEGER;
        let xMax = Number.MIN_SAFE_INTEGER;
        let yMin = Number.MAX_SAFE_INTEGER;
        let yMax = Number.MIN_SAFE_INTEGER;

        this.nodes.forEach(node => {
            xMin = Math.min(node.position.x, xMin);
            yMin = Math.min(node.position.y, yMin);
            xMax = Math.max(node.position.x + node.size.x, xMax);
            yMax = Math.max(node.position.y + node.size.y, yMax);
        });

        let width = xMax - xMin;
        let height = yMax - yMin;

        return new Vector2(-width * 0.5 -xMin , -height * 0.5 -yMin);
    }
}
