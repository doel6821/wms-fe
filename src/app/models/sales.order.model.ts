import { Meta } from "./auth.model";
import { Customer } from "./customer.model";
import { RequestProduct } from "./product.model";

export class SalesOrderRequest {
    constructor(
        public id?: number,
        public customerId?: number,           
        public customer?: Customer,          
        public amount?: number,         
        public discount?: number,              
        public totalAmount?: number,
        public statusPembayaran?: string,         
        public items?: SalesOrderItem[],
        public orderDate?: string,
    ){}

}

export class SalesOrderItem {
    constructor(
        public id?: number,
        public productId?: number,
        public product?: RequestProduct,  
        public customerId?: number,           
        public customer?: Customer,   
        public name?: string,
        public code?: string,
        public orderQty?: number, 
        public allocationOrderQty?: number,   
        public backOrderQty?: number,
        public packingOrderQty?: number,  
        public invoiceOrderQty?: number,   
        public price?: number, 
        public totalAmount?: number, 
    ){}
}

export interface SalesOrderQueryParams {
  customerId?: number;
  allocation?: string;
  page?: number;
  limit?: number;
}

export class SalesOrderListResponse {
    constructor(
        public meta?: Meta,
        public data?: SalesOrderRequest[],
    ){}
}

export class PackingOrderRequest {
    constructor(
        public customerId?: number,
        public salesOrderIds?: number[],
    ){}
}

export class InvoiceRequest {
    constructor(
	    public packingOrderId?: number,
    ){}
}