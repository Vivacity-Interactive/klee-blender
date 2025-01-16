import { Canvas2D } from "./canvas";
import { Controller } from "./controller";
import { BLOEFPopulate } from "./parser/ueof-blender-populate";
import { Scene } from "./scene";
import { GraphUtils } from "./utils/graph-utils";

export class Application {

    private _scene: Scene;
    private _canvas: Canvas2D;

    private _controller: Controller;
    private _populator: BLOEFPopulate;
    private _element: HTMLCanvasElement;

    private static firefox: boolean;
    private static instances: Array<Application> = [];

    private allowPaste: boolean;

    private constructor(element: HTMLCanvasElement) {
        this._element = element;

        if (navigator.userAgent.indexOf("Firefox") > 0) {
            Application.firefox = true;
        }


        this._canvas = new Canvas2D(element);
        this._scene = new Scene(this._canvas, this);

        this.initializeHtmlAttributes();

        this.loadNodeGroupIntoScene(element.innerHTML);

        this._controller = new Controller(element, this);
        this._controller.registerAction({
            ctrl: true,
            shift: false,
            keycode: 'KeyC',
            callback: this.copyNodeGroupSelectionToClipboard.bind(this)
        });
        this._controller.registerAction({
            ctrl: false,
            shift: false,
            keycode: 'Home',
            callback: this.recenterCamera.bind(this),
        })

        this._controller.registerAction({
            ctrl: true,
            keycode: 'KeyV',
            shift: false,
            callback: this.pasteClipboardContentToCanvas.bind(this)
        });
        this._element.onpaste = (ev) => this.onPaste(ev);

        window.addEventListener('resize', this.refresh.bind(this), false);
    }

    get scene() {
        return this._scene;
    }

    get canvas() {
        return this._canvas;
    }

    static get isFirefox() {
        return this.firefox;
    }

    public getNodeGroup(): string {
        let textLines = [];
        this._scene.nodes.forEach(n => textLines = [].concat(textLines, n.sourceText));
        return textLines.join('\n');
    }

    private initializeHtmlAttributes() {
        this._element.style.outline = 'none';

        let attrPaste = this._element.getAttributeNode("data-klee-paste");
        this.allowPaste = attrPaste?.value == "true" || false;
    }

    public refresh() {
        this._element.width = this._element.offsetWidth;
        this._element.height = this._element.offsetHeight;
        this._scene.collectInteractables();
        this._scene.updateLayout();
        this._scene.refresh();
    }

    private copyNodeGroupSelectionToClipboard() {
        console.log("Copy selection");

        let scope = { _enums: {}, _options: {}, nodes: [], links: [] };
        // TODO needs improvement (not efficent at all)
        let _links = new Set<any>();
        let _enums = new Set<string>();
        const _this = this;
        const _graph = this.scene.graph;
        this._scene.nodes.forEach(n => {
            if (n.selected) {
                scope.nodes.push(n.node._raw);
                this._scene.links.filter(l => {
                    const bLink = l.link.fromNodeID == n.node.id || l.link.toNodeID == n.node.id;
                    if (bLink) { _links.add(l.link._raw); }
                    return bLink;
                })
                const options = _graph._options[n.node.cid]
                if (options) { scope._options[n.node.cid] = options; }
                
                GraphUtils.traverse_enums(n.node._raw, _enums, _graph);
            }
        });
        
        for (const eid of _enums) { scope._enums[eid] = _graph._enums[eid]; }

        scope.links = Array.from(_links);
        navigator.clipboard.writeText(JSON.stringify(scope));
        return true;
    }

    private pasteClipboardContentToCanvas(ev) {
        if (!this.allowPaste) return;
        if (Application.isFirefox) {
            return false;
        }

        console.log("Paste from clipboard");

        navigator.clipboard.readText().then((text) => {
            if(!text) return;
            this.loadNodeGroupIntoScene(text);
        });

        return true;
    }

    private onPaste(ev) {
        if (!this.allowPaste) return;
        console.log("Paste from clipboard");
        let text = ev.clipboardData.getData("text/plain");
        this.loadNodeGroupIntoScene(text);
    }

    public loadNodeGroupIntoScene(text) {
        this._scene.unload();
        this._populator = new BLOEFPopulate(JSON.parse(text));
        this._populator.populate();
        this._scene.load(this._populator.graph);
        this.refresh();
        this.recenterCamera();
        
    }

    recenterCamera() {
        // Move camera to the center of all nodes
        this._scene.camera.centerAbsolutePosition(this._scene.calculateCenterPoint());
        this._scene.camera.zoomAbsolute(1.0)
        this.refresh();
        return true;
    }

    static registerInstance(element: HTMLCanvasElement, app: Application) {
        element.setAttribute("data-klee-instance", Application.instances.length.toString());
        Application.instances.push(app);
    }

    public static getInstance(element: HTMLCanvasElement): Application {
        let instanceAttr = element.getAttributeNode("data-klee-instance");
        if (instanceAttr) {
            let id = Number.parseInt(instanceAttr.value);
            if (!isNaN(id) && id < Application.instances.length) {
                let instance = Application.instances[id];
                return instance;
            }
        }

        return undefined;
    }

    public static createOrGet(element: HTMLCanvasElement): Application {
        let instance = this.getInstance(element);
        if (instance !== undefined) {
            return instance;
        }

        let app = new Application(element)
        Application.registerInstance(element, app);

        return app;
    }
}
