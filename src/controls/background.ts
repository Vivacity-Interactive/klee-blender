import { Application } from "../application";
import { Camera } from "../camera";
import { Canvas2D } from "../canvas";
import { Control } from "./control";
import { DrawableControl } from "./interfaces/drawable";

// TODO: Don't implement as background control. Move to camera
export class Background extends Control implements DrawableControl {

    private static readonly BACKGROUND_SVG = 'data:image/svg+xml,' + escape('<svg width="96px" height="96px" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" xmlns:serif="http://www.serif.com/" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:1.5;"><rect x="0" y="0" width="96.375" height="96" style="fill:#282828;stroke:#282828;stroke-width:0.75px;"/></svg>');

    loaded: boolean;
    ready: boolean;
    image: HTMLImageElement;
    pattern: CanvasPattern;
    camera: Camera;

    constructor(camera: Camera) {
        super(0, 0, -1000);

        this.camera = camera;
        this.ready = false;

        this.image = new Image();
        this.image.onload = (ev) => this.onLoaded(ev);
        this.image.src = Background.BACKGROUND_SVG;
    }

    override initialize() {
        if (this.loaded)
            this.initPattern();
    }

    draw(canvas: Canvas2D) {
        if (!this.ready) return;

        canvas.fillStyle(this.pattern)
            .fillRect(-this.camera.position.x, -this.camera.position.y, canvas.width, canvas.height);
    }

    private onLoaded(ev : Event) {
        this.loaded = true;
        if (this.app) {
            this.initPattern();
        }
    }

    private initPattern() {
        this.pattern = this.app.canvas.getContext().createPattern(this.image, 'repeat');
        this.ready = true;

        this.app.scene.refresh();
    }
}
