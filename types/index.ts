// /types/index.ts

export interface Role {
    id: number;
    name: string;
}

export interface User {
    id: string;
    regNumber: string;
    email: string;
    password: string;
    roleId: number;
    resetToken: string | null;
    resetTokenExpiry: Date | null;
    role: Role;
}

export interface Token {
    regNumber?: string;
    iat?: number;
    exp?: number;
    [key: string]: any;
}
