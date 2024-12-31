export class Data {
    status?: string
    code?: string
    message?: string
    data?: Bridal[]
    name?: string
    totalItems?: number
    totalPages?: number
    currentPage?: number
}

export class Bridal {
    uuid?: string
    name?: string
    description?: string
    mrp?: number
    price?: number
    offer?: number
    path?: string
    video?: string
    wishlist?: number
    brand?: string
    slug?:string
}
