import { Supplier } from "./supplier.model"

export class ReceiveOrder {
    constructor (
        public id?: number,
	    public supplierId?: number,
        public supplier?: Supplier,
	    public invoiceNumber?: string,
	    public receiveDate?: string,
	    public status?: string,
	    public dueDate?: string,
        public paymentStatus?: string,
        public totalAmount?: number,
        public items?: Item[],
    ){}
}


export class Item {
    constructor (
	    public id?: number,
        public receiveOrderId?: number,
        public purchaseOrderId?: number,
        public productId?: number,
        public productCode?: string,
        public productName?: string,
        public productLocation?: string,
        public receiveOrderQty?: number,
        public purchasePrice?: number,
    ){}
}

export class PaymentReceiveRequest {
    constructor (
		public id?: number,
		public receiveId?: number,
        public invoiceNumber?: string,
		public paymentDate?: number,
	    public paymentMethod?: string,
		public referenceNumber?: string,
	    public amount?: number,
		public notes?: string,
    ){}
}




    
            