import { Customer } from "./customer.model";
import { Product } from "./product.model";

export class InvoiceOrderRequest {
    constructor (
	    public id?: number,
		public customerId?: number,
	    public customer?: Customer,          
	    public InvoiceDate?: string,
	    public status?: string,
	    public items?: InvoiceOrderItem[],
    ){}
}

export interface InvoiceListQueryParams {
  customerName?: string;
  customerId?: number;
  page?: number;
  limit?: number;
}

export class InvoiceOrderItem {
    constructor (
		public id?: number,
		public InvoiceOrderId?: number,
		public salesOrderId?: number,
	    public productId?: number,
		public product?: Product,
	    public productCode?: string,
		public productName?: string,
	    public InvoiceOrderQty?: number,
		public productLocation?: number,
    ){}
}

