export enum PinLinkState {
    NONE = 0,
    VALID = 1 << 0,
    MUTED = 1 << 1,
    HIDDEN = 1 << 2,
    DEFAULT = VALID
}

export class PinLink {
    _raw: any;
    id: string | number;
    state: PinLinkState;
    fromNodeID: string|number;
    fromPinID: string|number;
    toNodeID: string|number;
    toPinID: string|number;
    sortID: number;
}
