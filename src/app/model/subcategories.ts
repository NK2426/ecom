export class Subcategory {
  status?: string
  code?: string
  message?: string
  data?: SubcategoryList
}

export class SubcategoryList {
  cid?: number
  uuid?: string
  name?: string
  name_ta?: string
  image?: string
  icon?: string
  description?: string
  topleveltags?: string
  groups?: SubcategoryData[]
}

export class SubcategoryData {
  id?: number
  uuid?: string
  name?: string
  name_ta?: string
  image?: string
  icon?: string
  description?: string
  type?: string
  slug?: string
}