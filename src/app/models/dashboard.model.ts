import { Meta } from "./auth.model";

export class Sales {
    constructor(
        public totalItem?: number,
        public totalOrderQty?: number,
        public totalAllocationQty?: number,
        public totalBackOrderQty?: number,
        public totalPackingOrderQty?: number,
        public totalInvoiceQty?: number,
        public totalAmount?: number,
    ){}
}

export class Purchase {
    constructor(
        public totalItem?: number,
        public totalOrderQty?: number,
        public totalReceiveQty?: number,
        public totalStockedQty?: number,
        public totalAmount?: number,
    ){}
}

export class DashboardResponseData {
    constructor(
        public sales?: Sales,
        public purchase?: Purchase,
        public totalPaymentSupplier?: number,
        public totalReceivePaymentCustomer?: number,
    ){}
}

export interface DashboardQueryParams {
    startDate?: string;
    endDate?: string;
}

export class DashboardResponse {
    constructor(
        public meta?: Meta,
        public data?: DashboardResponseData,
    ){}
}