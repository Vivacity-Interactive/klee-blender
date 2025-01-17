
export enum PropertySubCategory {
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


export enum PropertyType {
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
    ENUM,
    POINTER,
    _UNKNOWN
}

export enum PropertyState {
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
    RUNTIME = 1 << 14,
    ANIMATABLE = 1 << 15,
    DEFAULT = ENABLED
}

