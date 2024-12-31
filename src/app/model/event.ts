export interface liveEvents {
    status: string
    code: string
    message: string
    data: liveEventsData
  }
  
  export interface liveEventsData {
    datas: liveEvents[]
    currentPage: number
    totalItems: number
    totalPages: number
  }
  
  export interface liveEvents {
    id: number
    title: string
    link:string
    link_name:string
    content: string
    image: string
    type:string
    createdAt: string
    updatedAt: string
    slug: string
  }