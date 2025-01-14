import { PinLinkState } from "./pin-link-enums";

export class PinLink {
    _raw: any;
    id: string|number;
    state: PinLinkState;
    fromNodeID: string|number;
    fromPinID: string|number;
    toNodeID: string|number;
    toPinID: string|number;
    sortID: number;
}
