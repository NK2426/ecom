// export class CategoryList {
//   status?: string
//   code?: string
//   message?: string
//   data?: Category[]
// }

// export class Category {
//   uuid?: string
//   name?: string
//   name_ta?: string
//   image?: string
//   icon?: string
//   description?: string
//   subcategories?: Subcategory[]
// }

// export class Subcategory {
//   uuid?: string
//   name?: string
//   image?: string
//   icon?: string
//   description?: string
// }
//////////////////////////////////////////

export class CategoryList {
  status?: string
  code?: string
  message?: string
  data?: Data
}

export class Data {
  did?: number
  uuid?: string
  name?: string
  image?: string
  icon?: string
  description?: string
  topleveltags?: string
  categories?: Category[]
}

export class Category {
  uuid?: string
  name?: string
  name_ta?: string
  image?: string
  icon?: string
  description?: string
  type?: string
  slug?: string
  data: any
}
