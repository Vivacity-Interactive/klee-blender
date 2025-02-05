import { Application } from "./application";

export class KleeBlender {

    private app: Application;

    constructor(canvas: HTMLCanvasElement, app?: Application) {
        if (app !== undefined) {
            this.app = app;
        } else {
            this.app = Application.createOrGet(canvas);
        }
    }

    public display(nodeGroupText: string): void {
        this.app.loadNodeGroupIntoScene(nodeGroupText);
    }

    public static getInstance(canvas: HTMLCanvasElement) {
        let app = Application.getInstance(canvas);
        if (app !== undefined) {
            return new KleeBlender(canvas, app);
        }
        return undefined;
    }

    public get value(): string {
        return this.app.getNodeGroup();
    }
}

export function init(canvas: HTMLCanvasElement) {
    return new KleeBlender(canvas);
}

export function get(canvas: HTMLCanvasElement) {
    return KleeBlender.getInstance(canvas);
}

function initialize() {
    document.querySelectorAll('canvas.klee-blender').forEach((canvas: HTMLCanvasElement) => {
        new KleeBlender(canvas);
    });
}

window.addEventListener("load", initialize);