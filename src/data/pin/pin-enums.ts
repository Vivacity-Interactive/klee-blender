import { IconCategory } from "../icon-category";

export enum PinState {
    NONE = 0,
    MUTED = 1 << 0,
    HIDDEN = 1 << 1,
    ENABLED = 1 << 2,
    OPTIONS = 1 << 3,
    ADVANCED = 1 << 4,
    LATENT = 1 << 5,
    DEPRECATED = 1 << 6,
    SELECTED = 1 << 7,
    NAMELESS = 1 << 8,
    VALUELESS = 1 << 9,
    UNAVAILABLE = 1 << 10,
    MULTI = 1 << 11,
    GIZOM = 1 << 12,
    LINKED = 1 << 13,
    DEFAULT = ENABLED
}

export enum PinType {
	VALUE,
    INT,
    BOOLEAN,
    VECTOR,
    ROTATION,
    MATRIX,
    STRING,
    RGBA,
    SHADER,
    OBJECT,
    GEOMETRY,
    COLLECTION,
    TEXTURE,
    MATERIAL,
    MENU,
    IMAGE,
    CUSTOM,
    _UNKNOWN
};

export enum PinCategory {
	Float,
    Int,
    Bool,
    Vector,
    Rotation,
    Matrix,
    String,
    Color,
    Shader,
    Object,
    Geometry,
    Collection,
    Texture,
    Material,
    Menu,
    Image
};

export enum PinSubCategory {
    None,
    Angle,
    ColorTemperature,
    Distance,
    Frequency,
    Time,
    TimeAbsolute,
    Wavelength,
    Factor,
    Percentage,
    Unsigned,
    FilePath,
    Acceleration,
    Direction,
    Euler,
    Translation,
    Velocity,
    XYZ
}

export enum PinDirection {
    Input,
    Output
}

export enum PinShape {
    CIRCLE = IconCategory.KEY_RING_FILLED,
    SQUARE = IconCategory.KEY_EMPTY3_FILLED,
    DIAMOND = IconCategory.KEYFRAME_HLT,
    CIRCLE_DOT = IconCategory.KEY_RING,
    SQUARE_DOT = IconCategory.KEY_EMPTY3,
    DIAMOND_DOT = IconCategory.KEYFRAME
}

