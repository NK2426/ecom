export class Root {
  status?: string
  code?: string
  message?: string
  data?: SingleProductData
}

export class SingleProductData {
  item?: SingleProduct
  images?: Image[]
  productvariants?: any[]
  sets?: any[]
  listvariants?: Listvariants
  wishlist?: number
  brand?: string
  cart?: number
  pincode?: Pincode
}

export class SingleProduct {
  id?: number
  uuid?: string
  name?: string
  name_ta?: string
  description?: string
  description_ta?: string
  path?: string
  mrp?: number
  price?: number
  itemslist_uuid?: string
  product_id?: number
  group_id?: number
  offer?: number
  status?: string
  rating?: string
  comboset_id?: number
  combo_id?: number
  iscombo?: number
  itemslist?: Itemslist
  quantity?: number
}

export class Itemslist {
  status?: number
  quantity?: number
  uuid?: string
}

export class Image {
  path?: string
  variantvalue_id?: number
}

export class Listvariants {
  "11"?: number
}

export class Pincode {
  pincode?: string
  available?: number
}
