import { UnitTest } from "./unit-test";

export class UnitTestBLOF extends UnitTest {
    protected DATA_NULL = null;
    protected DATA_EMPTY = "";
    protected DATA_ALL_BLENDER: string = <string>require("./all-blender.blof").default;

    public testPopulate() {
        // Todo
    }
}