export interface LoginRequest { 
    tenant: string; 
    email: string; 
    password: string;
    role: string; 
}

export interface AuthUser {
    token:string;
    tokenType:string;
    expiresIn: number;
}

export interface Meta {
    code: string;
    title: string;
    message: string;
}

export interface AuthResponse {
    data: Meta;
    meta: AuthUser;
}


