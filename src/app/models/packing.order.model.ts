import { Customer } from "./customer.model";
import { Product } from "./product.model";

export class PackingOrderRequest {
    constructor (
	    public id?: number,
		public customerId?: number,
	    public customer?: Customer,          
	    public packingDate?: string,
	    public status?: string,
	    public items?: PackingOrderItem[],
    ){}
}

export interface PackingOrderQueryParams {
  customerName?: string;
  customerId?: number;
  page?: number;
  limit?: number;
}

export class PackingOrderItem {
    constructor (
		public id?: number,
		public packingOrderId?: number,
		public salesOrderId?: number,
	    public productId?: number,
	    public productCode?: string,
		public productName?: string,
	    public packingOrderQty?: number,
		public productLocation?: number,
    ){}
}

