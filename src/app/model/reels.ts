export interface Reels {
    status?: string
    code?: string
    message?: string
    data?: Data
}

export interface Data {
    datas?: Reels[]
    currentPage?: number
    totalItems?: number
    totalPages?: number
}

export interface Reels {
    id?: number
    uuid?: string
    name?: string
    description?: string
    path?: string
    vpath?: string
    mrp?: number
    price?: number
    product_id?: number
    group_id?: number
    status?: string
    itemslist_uuid?: string
    wishlist?: number
    cart?: number
    slug?:string
}
