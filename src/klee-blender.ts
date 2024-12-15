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

    public display(blueprintText: string): void {
        this.app.loadBlueprintIntoScene(blueprintText);
    }

    public static getInstance(canvas: HTMLCanvasElement) {
        let app = Application.getInstance(canvas);
        if (app !== undefined) {
            return new KleeBlender(canvas, app);
        }
        return undefined;
    }

    public get value(): string {
        return this.app.getBlueprint();
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

/// #if UNIT_TEST
import { UnitTest } from "./tests/unit-test";
import { UnitTestTokenUtils } from "./tests/unit-test-token-utils";
import { UnitTestUEOFParser } from "./tests/unit-test-ueof-parser";

window.addEventListener("load", () => {
    let units: Array<UnitTest> = [
        new UnitTestTokenUtils(),
        new UnitTestUEOFParser(),
    ];
    
    for (const unit of units) { unit.execute(); }
});
/// #endif