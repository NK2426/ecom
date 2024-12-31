export class Root {
    status?: string
    code?: string
    message?: string
    data?: Exclusive[]
    name?: string
    totalItems?: number
    totalPages?: number
    currentPage?: number
}

export class Exclusive {
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
