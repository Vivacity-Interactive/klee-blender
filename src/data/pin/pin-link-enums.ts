
export enum PinLinkState {
    NONE = 0,
    VALID = 1 << 0,
    MUTED = 1 << 1,
    HIDDEN = 1 << 2,
    DEFAULT = VALID
}
