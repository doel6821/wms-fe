export class SalesOrderRequest {
    constructor(
        public id?: number,
        public customerId?: number,           
        public customerName?: string,          
        public amount?: number,         
        public discount?: number,              
        public totalAmount?: number,         
        public orderItems?: SalesOrderItem[],
    ){}

}

export class SalesOrderItem {
    constructor(
        public id?: number,
        public productId?: number,     
        public orderQty?: number,     
        public price?: number, 
        public totalAmount?: number, 
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