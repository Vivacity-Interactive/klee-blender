import { UserControl } from "../user-control";

type UserControlConstrutor = new (...parms: any) => UserControl

export enum CustomUserClass {

}

export class UserUtils {
    public static getUserControl(key:string): UserControlConstrutor {
        const _key = CustomUserClass[key as keyof CustomUserClass];
        const _class = LOT_USER_CONTROL[_key] ?? null;
        return _class;
    }

    public static resolveUserControl(key: string): UserControlConstrutor {
        const _unknown = null;
        
        for (const _key in LOT_USER_RESOLVE_CONTROL) {
            const regex: RegExp = LOT_USER_RESOLVE_CONTROL[_key];
            const bMatch = regex && regex.test(key);
            
            if (bMatch) {
                return LOT_USER_CONTROL[_key] ?? _unknown;
            }
        }
        
        return _unknown;
    }
}

export const LOT_USER_CONTROL: { [key in CustomUserClass]: UserControlConstrutor } = {

}

export const LOT_USER_RESOLVE_CONTROL:  Partial<{ [key in CustomUserClass]: RegExp }> = {

};