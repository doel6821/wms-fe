import { Supplier } from "./supplier.model"

export class ReceiveOrder {
    constructor (
        public id?: number,
	    public supplierId?: number,
        public supplier?: Supplier,
	    public invoiceNumber?: number,
	    public receiveDate?: string,
	    public status?: string,
	    public dueDate?: string,
        public paymentStatus?: string,
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



    
            