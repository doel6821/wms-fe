export class LoginRequest {
    constructor( 
        public tenant?: string,
        public email?: string,
        public password?: string,
        public role?: string,
    ){}
}

export class AuthUser {
    constructor(
        public token?:string,
        public tokenType?:string,
        public expiresIn?: number,
    ){}
}

export class Meta {
    constructor(
        public code?: string,
        public title?: string,
        public message?: string,
    ){}
}

export class AuthResponse {
    constructor(
        public data?: Meta,
        public meta?: AuthUser,
    ){}
}


