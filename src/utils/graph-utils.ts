import { Graph } from "../data/graph";

export class GraphUtils {
    public static traverse_enums(scope, into: Set<string>, graph: Graph): void {
        if (scope) for(const key in scope) {
            const _val = scope[key];
            const _enum = _val && _val.length == 2 && graph._enums[_val[1]];
            if (_enum) { into.add(_val[1]); }
            else if (Array.isArray(_val)) for (const x in _val) { this.traverse_enums(x, into, graph); }
            else if (typeof _val === 'object') { this.traverse_enums(_val, into, graph); }
        }
    }
}