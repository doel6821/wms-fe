import { Customer } from "./customer.model";
import { Product } from "./product.model";

export class SalesInvoice {
    constructor (
	    public id?: number,
		public customerId?: number,
	    public customer?: Customer,          
	    public invoiceDate?: string,
		public invoiceNumber?: string,
		public amount?: number,
		public totalAmount?: number,
	    public status?: string,
		public dueDate?: string,
		public paymentStatus?: string,
	    public invoiceItems?: InvoiceOrderItem[],
    ){}
}

export interface InvoiceListQueryParams {
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
	    public quantity?: number,
		public price?: number,
		public total?: number,
		public productLocation?: number,
    ){}
}

export class PaymentRequest {
    constructor (
		public id?: number,
		public invoiceId?: number,
		public invoiceNumber?: string,
		public paymentDate?: number,
	    public paymentMethod?: string,
		public referenceNumber?: string,
	    public amount?: number,
		public notes?: string,
    ){}
}
