import { Meta } from "./auth.model";

export class Supplier {
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

export interface SupplierQueryParams {
  id?: number,  
  name?: string;
  page?: number;
  limit?: number;
}

export class SupplierListResponse {
    constructor(
        public meta?: Meta,
        public data?: Supplier[],
    ){}
}

export class RequestSupplier {
    constructor(
        public id?: number,
        public name?: string,
        public email?: string,
        public phone?: string,
        public address?: string,
        public discountPercent?: number,
        public termOfPayment?: string,
    ){}
}
