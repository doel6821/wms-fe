import { Product } from "./product.model";
import { Item } from "./receive.model";
import { Supplier } from "./supplier.model";

export class PurchaseOrderRequest {
    constructor (
		public id?: number,
		public orderDate?: string,
		public purchaseNumber?: string,
	    public supplierId?: number,
	    public supplier?: Supplier,          
	    public amount?: number,
	    public discount?: number,
	    public totalAmount?: number,
	    public orderItems?: PurchaseOrderItem[],
    ){}
}

export interface PurchaseOrderQueryParams {
  supplierName?: string;
  supplierId?: number;
  page?: number;
  limit?: number;
}

export class PurchaseOrderItem {
    constructor (
		public id?:number,
		public supplierId?: number,
	    public supplier?: Supplier,          
		public purchaseOrderId?:number,
	    public productId?: number,
		public product?: Product,
	    public productName?: string,
	    public orderQty?: number,
		public receiveOrderQty?: number,
		public stockedOrderQty?: number,
		public planReceive?: number,
		public purchasePrice?: number,
	    public price?: number,
		public subTotal?: number,
		public discount?: number,
	    public totalAmount?: number,
    ){}
}

export class ReceiveOrderRequest {
    constructor (
	    public supplierId?: number,
		public invoiceNumber?: string,
	    public receiveOrders?: ReceiveOrderDetail[],
    ){}
}

export class ReceiveOrderDetail {
    constructor (
	    public supplierId?: number,
	    public purchaseOrderId?: number,
		public invoiceNumber?: number,
	    public productId?: number,
	    public productName?: string,
	    public productPrice?: string,
	    public receiveQtty?: number,
    ){}
}

export class StockedRequest {
    constructor (
	    public receiveOrderId?: number,
		public items?:Item[],
    ){}
}
