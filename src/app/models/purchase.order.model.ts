export class PurchaseOrderRequest {
    constructor (
	    public supplierId?: number,
	    public supplierName?: string,
	    public amount?: number,
	    public discount?: number,
	    public totalAmount?: number,
	    public orderItems?: PurchaseOrderItem[],
    ){}
}

export class PurchaseOrderItem {
    constructor (
	    public productId?: number,
	    public productName?: string,
	    public orderQty?: number,
	    public price?: number,
	    public totalAmount?: number,
    ){}
}

export class ReceiveOrderRequest {
    constructor (
	    public supplierId?: number,
	    public receiveOrders?: ReceiveOrderDetail[],
    ){}
}

export class ReceiveOrderDetail {
    constructor (
	    public supplierId?: number,
	    public purchaseOrderId?: number,
	    public productId?: number,
	    public productName?: string,
	    public productPrice?: string,
	    public receiveQtty?: number,
    ){}
}

export class StockedRequest {
    constructor (
	    public receiveOrderId?: number,
    ){}
}
