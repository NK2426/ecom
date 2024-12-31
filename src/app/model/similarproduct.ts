export class Data {
    status?: string
    code?: string
    message?: string
    data?: SimilarProduct[]
}

export class SimilarProduct {
    uuid?: string
    name?: string
    description?: string
    mrp?: number
    price?: number
    offer?: number
    path?: string
    wishlist?: number
    brand?: string
}
