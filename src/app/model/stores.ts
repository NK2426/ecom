export interface Root {
    status?: string
    code?: string
    message?: string
    data?: Store[]
}

export interface Store {
    state_id: number
    state_image: string
    state_name: string
}


// GET STORES
export class storeData {
    status?: string
    code?: string
    message?: string
    data?: STORE[]
}
export class STORE {
    state_name?: string
    stores?: StoreSlug[]
}
export interface StoreSlug {
    store_name?: string
    slug?: string
}