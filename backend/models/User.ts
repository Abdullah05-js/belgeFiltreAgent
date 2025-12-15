import mongoose, { Schema } from "mongoose";
import type { IWithTimestamps } from "../types/types";

const ROLES = {
    admin: [
        "view:Documents",
        "create:Documents",
        "update:Documents",
        "delete:Documents",
    ],
    user: [
        "view:Documents",
        "create:Documents",
    ],
} as const;

type Role = keyof typeof ROLES;
type Permission = (typeof ROLES)[Role][number];

export function hasPermission(
    role: Role,
    permission: Permission
): boolean {
    return (ROLES[role] as readonly Permission[]).includes(permission)
}

export interface IUser extends IWithTimestamps {
    sicilNo: number;
    password: string;
    role: Role;
}

const UserSchema = new Schema<IUser>(
    {
        sicilNo: {
            type: Number,
            required: true,
        },
        password: {
            type: String,
            required: true,
            trim: true,
        },
        role: {
            type: String,
            enum: Object.keys(ROLES) as Role[],
            default: "user",
        },
    },
    {
        timestamps: true,
    }
);

UserSchema.index({ sicilNo: 1 });

export const UserModel = mongoose.model<IUser>("User", UserSchema);
export type UserDocument = mongoose.HydratedDocument<IUser>;
//const user: UserDocument = await UserModel.findById(id);






