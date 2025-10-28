import { Meta } from "./auth.model";

export class Customer {
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

export interface CustomerQueryParams {
  name?: string;
  page?: number;
  limit?: number;
  customerId?: number;
}

export class CustomerListResponse {
    constructor(
        public meta?: Meta,
        public data?: Customer[],
    ){}
}
