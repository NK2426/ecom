export interface GroupList {
    status: string
    code: string
    message: string
    data: GroupItems[]
  }
  
  export interface GroupItems {
    uuid: string
    name: string
    name_ta: string
    image: string
    icon: string
    description: string
    slug?: string
  }
  export interface Products {
    uuid: string
    name: string
    mrp: number
    price: number
    path: string
    wishlist: number
    brand?: string
    offer?:number
    slug?: string
  }

  