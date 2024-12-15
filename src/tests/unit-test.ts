class _UnitTestAssert {
    public Fail(msg: string = "forced") {
        throw new Error(msg);
    }

    public True(bTrue: boolean, msg: string = "not true") {
        if (!bTrue) { throw new Error(msg); }
    }

    public False(bTrue: boolean, msg: string = "not false") {
        if (bTrue) { throw new Error(msg); }
    }

    public Equal(expected: any, value: any, msg: string = "not equal") {
        if (expected != value) {throw new Error(msg)}
    }

    public NotEqual(expected: any, value: any, msg: string = "not equal") {
        if (expected == value) {throw new Error(msg)}
    }

    public Similar(expected: any, value: any, compare: (a:any, b:any) => number, error: number = 0, msg: string = "not similar") {
        if (compare(expected, value) <= error) {throw new Error(msg)}
    }

    public NoError(call: () => void, msg: string = "has error") {
        try {
            call();
        } catch (error) {
            throw new Error(msg);
        }
    }

    public Error<T extends Error>(expected: new() => T, call: () => void, msg: string = "not of error") {
        let bError = false;
        try {
            call()
        } catch (error) {
            bError = true;
            let bTrue = error instanceof expected;
            if (!bTrue) { throw new Error(msg); }
        }
        if (!bError) { throw new Error(msg); }
    }
}

export class UnitTest {
    static readonly UNIT_TEST_PREFIX = "test";
    static readonly _AssertInstance = new _UnitTestAssert();
    
    protected Assert: _UnitTestAssert = UnitTest._AssertInstance;

    public execute() {
        this.setup();
        let _obj = Object.getPrototypeOf(this);
        let _fxs = Object.getOwnPropertyNames(_obj);
        console.info(`${this.constructor.name}`);
        for (let fx of _fxs ) {
            let bRun = fx.startsWith(UnitTest.UNIT_TEST_PREFIX);
            if (bRun) {
                try {
                    this[fx]();
                    console.info(`\t\x1b[32m${fx} : success\x1b[0m`);
                } catch (error) {
                    console.error(`\t${fx} : failed - ${error}`);
                }
                
            }
        }
        this.teardown();
    }
    
    public setup() {};
    
    public teardown() {};
}