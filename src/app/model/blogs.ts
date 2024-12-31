export interface Blog {
    status: string
    code: string
    message: string
    data: BlogData
  }
  
  export interface BlogData {
    datas: Blogs[]
    currentPage: number
    totalItems: number
    totalPages: number
  }
  
  export interface Blogs {
    id: number
    title: string
    content: string
    image: string
    createdAt: string
    updatedAt: string
    slug: string
  }