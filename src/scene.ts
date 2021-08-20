import { Camera } from "./camera";
import { Canvas2D } from "./canvas";
import { Background } from "./controls/background";
import { Control } from "./controls/control";
import { DrawableControl, isDrawableControl } from "./controls/interfaces/drawable";
import { NodeConnectionControl } from "./controls/node-connection.control";
import { NodeControl } from "./controls/nodes/node.control";
import { Vector2 } from "./math/vector2";
import { PinDirection } from "./data/pin/pin-direction";
import { NodePinsCreator } from "./controls/utils/node-pins-creator";

export class Scene {

    private _canvas: Canvas2D;
    private _camera: Camera;

    private _controls: Array<Control>;
    private _nodes: Array<NodeControl>;

    constructor(canvas: Canvas2D) {
        this._canvas = canvas;
        this._camera = new Camera(this._canvas);
        this._nodes = new Array<NodeControl>();
        this._controls = new Array<Control>();
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

    refresh() {
        this._canvas.clear();

        this._controls.sort((a, b) => {
            return a.zIndex - b.zIndex;
        });

        this._camera.prepareViewport();
        this._controls.forEach((control) => {
            if (isDrawableControl(control)) {
                (control as DrawableControl).draw(this._canvas);
            }
        });
    }

    unload() {
        NodePinsCreator.resetPinsControls();
        this._nodes = new Array<NodeControl>();
        this._controls = new Array<Control>();
    }

    load(dataNodes: NodeControl[]) {
        this.createBackground();

        this.createControlNodes(dataNodes);

        // Creates connection lines between pins
        this.createConnectionLines();
    }

    private createBackground() {
        let background = new Background('/assets/sprites/bp_grid.png', this.camera);
        this._controls.push(background);
    }

    private createControlNodes(controls: NodeControl[]) {
        for (const control of controls) {
            this._nodes.push(control);
            this._controls.push(control);
        }
    }

    private createConnectionLines() {
        const pins = Array.from(NodePinsCreator.pinsControls);

        for (let i = pins.length - 1; i >= 0; --i) {
            let pin = pins[i];
            if (pin.pinProperty.direction !== PinDirection.EGPD_Output)
                continue;


            let links = pin.pinProperty.linkedTo;

            if (!links)
                continue;

            for (let n = 0; n < pin.pinProperty.linkedTo.length; ++n) {
                let link = pin.pinProperty.linkedTo[n];
                let otherPin = pins.find(p => p.pinProperty.id === link.pinID);

                if (!otherPin)
                    continue;

                let connection = new NodeConnectionControl(pin, otherPin);
                this._controls.push(connection);
            }

            let index = pins.indexOf(pin);
            if (index >= 0) {
                pins.splice(index, 1);
            }
        }
    }

    calculateCentroid(): Vector2 {
        let centroid = new Vector2(0, 0);

        this.nodes.forEach(node => {
            centroid = new Vector2(
                centroid.x - node.position.x - node.size.x / 2,
                centroid.y - node.position.y - node.size.y / 2);
        });

        return new Vector2(centroid.x / this.nodes.length, centroid.y / this.nodes.length);
    }
}