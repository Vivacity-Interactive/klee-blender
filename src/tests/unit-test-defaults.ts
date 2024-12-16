export class _UnitTestDefaults {
    public static readonly CMP_STRING: (a: string, b: string) => number = (a: string, b: string): number => {
        let q:number = 0, r = 0;
        
        if (a) for (let n = 0; n < a.length; n++) { q += a.charCodeAt(n); }
        if (b) for (let n = 0; n < b.length; n++) { r += b.charCodeAt(n); }
        
        return r - q;
    }

    public static readonly CMP_OBJECT = (a: object, b: object): number => {
        const bAny: boolean = a !== null || b !== null;
        const K: number = -1;
        let q: number = 0, r = 0;
        let trace: Set<any>;
        let stack: Array<{ o: any, k: number }> = new Array();
        
        const _evalStr = (x: string): number => {
            let v: number = 0;
            for (let n = 0; n < x.length; n++) { v += x.charCodeAt(n); }
            return v;
        }
        
        const _evalArr = (x: Array<any>, k: number) => {
            let v: number = 0;
            for (let n = 0; n < x.length; n++) {
                const _o = x[n];
                const bObject = typeof _o !== 'object';
                const bPush = _o != null && (bObject || !trace.has(_o))
                if (bPush) { if (bObject) { trace.add(_o); } stack.push({o: _o, k: k }); }
            }
            return v
        }

        const _evalItr = (x: Iterable<any>, k: number) => {
            let v: number = 0;
            for (const _o of x) {
                const bObject = typeof _o !== 'object';
                const bPush = _o != null && (bObject || !trace.has(_o))
                if (bPush) { if (bObject) { trace.add(_o); } stack.push({o: _o, k: k }); }
            }
            return v
        }

        const _evalObj = (x: any, k: number): number => {
            let v: number = 0;
            if (typeof x === 'boolean') { v += x ? 1 : 0; }
            else if (typeof x === 'number') { v += x; }
            else if (typeof x === 'string') { v += _evalStr(x); }
            else if (x instanceof Map) { v += _evalItr(x.entries(), k); }
            else if (x instanceof Set) { v += _evalItr(x.values(), k); }
            else if (x instanceof Date) { v += x.getTime(); }
            else if (Array.isArray(x)) { v += _evalArr(x, k); }
            else if (typeof x === 'object') { v += _evalArr(Object.keys(x), k); _evalArr(Object.values(x), k); }
            else { v += x ? 1 : 0; }
            return v;
        }
        
        trace = new Set();
        if (a) { trace.add(a); stack.push({ o:a, k:0 }); };
        while(stack.length > 0) {
            const entry = stack.pop();
            const bPush = K < 0 || (entry.k + 1) < K;
            if (bPush) { q += _evalObj(entry?.o, entry.k); }
            trace.add(entry.o);
        }

        trace = new Set();
        if (b) { trace.add(b); stack.push({ o:b, k:0 }); };
        while(stack.length > 0) {
            const entry = stack.pop();
            const bPush = K < 0 || (entry.k + 1) < K;
            if (bPush) { r += _evalObj(entry?.o, entry.k); }
            trace.add(entry.o);
        }

        return r - q;
    }
}