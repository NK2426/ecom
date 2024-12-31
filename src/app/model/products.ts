export class Data {
  status?: string
  code?: string
  message?: string
  data?: Product
}

export class Product {
  datas?: ProductDetails[]
  currentPage?: number
  totalItems?: number
  totalPages?: number
  name?: string
}

export class ProductDetails {
  uuid?: string
  name?: string
  description?: string
  mrp?: number
  price?: number
  offer?: number
  path?: string
  wishlist?: number
  brand?: string
  slug?: string
}