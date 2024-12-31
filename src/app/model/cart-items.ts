
export class CartItem {
    constructor(public product: any, public amount: number) { }
}


export interface CartProduct {
    item_uuid: string
    itemslist_uuid: string
    qty: number
    mrp: number
    amount: number
    price?: number
    name: string
    path: string
    variant: string
    maxqty: number
    offer: number
}


export interface CartProductHttpResponse extends CommonHttpResponse {
    status: string
    code: string
    message: string
    data: CartProduct[]
}


export interface CommonHttpResponse {
    status: string
    code: string
    message: string
    data: any
}
export interface PlaceOrder {
    uuid: string
    orderID: string
    amount: number
    discount: number
}


export class CartData {
    status?: string
    code?: string
    message?: string
    data?: CartProducts[]
    product?: CartProductData[]
}

export class CartProducts {
    item_uuid?: string
    qty?: number
    mrp?: number
    amount?: number
    name?: string
    slug?: string
}

export class CartProductData {
    short_description?: string
    long_description?: string
    quantity?: number
    mrp?: number
    price?: number
    uuid?: string
    name?: string
}





