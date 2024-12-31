// export class TagsList {
//   status?: string
//   code?: string
//   message?: string
//   data?: Data
// }

// export interface Data {
//   datas?: Tag[]
//   totalItems?: number
//   totalPages?: number
//   currentPage?: number
// }

// export interface Tag {
//   uuid?: string
//   name?: string
//   path?: string
// }

export class TagsList {
  status?: string
  code?: string
  message?: string
  data?: Tag[]
  name?: string
  totalItems?: number
  totalPages?: number
  currentPage?: number
}

export class Tag {
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
  slug?: string
}
