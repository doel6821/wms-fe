export class RequestCustomer {
    constructor(
        public id?: number,
        public name?: string,
        public email?: string,
        public phone?: string,
        public address?: string,
        public discountPercent?: number,
        public termOfPayment?: string,
        public cancelOnBackOrder?: boolean,
    ){}
}
