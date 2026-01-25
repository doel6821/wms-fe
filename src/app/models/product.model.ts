import { Meta } from "./auth.model";
import { Supplier } from "./supplier.model";

export class RequestProduct {
    constructor(
        public id?: number,
        public code?: string,
        public name?: string,
        public supplierId?: number,
        public hetPrice?: number,
        public costPrice?: number,
        public avgPrice?: number,
        public stockOnHand?: number,
        public stockAllocation?: number,
        public stockBackOrder?: number,
        public stockPacking?: number,
        public stockOnPurchase?: number,
        public stockOnReceive?: number,
        // public leadTimeDays?: number,
    ){}
}

export class Product {
    constructor(
        public id?: number,
        public code?: string,
        public name?: string,
        public hetPrice?: number,
        public costPrice?: number,
        public avgPrice?: number,
        public stockOnHand?: number,
        public stockAllocation?: number,
        public stockBackOrder?: number,
        public stockPacking?: number,
        public stockOnPurchase?: number,
        public stockOnReceive?: number,
        public leadTimeDays?: number,
        public supplierId?: number,
        public supplier?: Supplier,
        public demands?: Demands,
        public productLocations?: ProductLocation[],
    ){}
}

export interface ProductQueryParams {
    code?: string;
    name?: string;
    supplier?: number;
    page?: number;
    limit?: number;
}

export class ProductListResponse {
    constructor(
        public meta?: Meta,
        public data?: Product[],
    ){}
}

 export class Demands {
    constructor(
        public id?: number,
        public productId?: number,
        public month?: string,
        public nQty?: number,
        public n1Qty?: number,
        public n2Qty?: number,
        public n3Qty?: number,
        public n4Qty?: number,
        public n5Qty?: number,
        public n6Qty?: number,
        public n7Qty?: number,
        public n8Qty?: number,
        public n9Qty?: number,
        public n10Qty?: number,
        public n11Qty?: number,
        public n12Qty?: number,
    ){}
}

export class ProductLocation {
    constructor(
	    public id?: number,
	    public productId?: number,
	    public locationId?: number,
	    public locationCode?: string,
	    public qtty?: number,
    ){}
}
