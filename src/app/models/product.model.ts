export class RequestProduct{
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
    ){}
}