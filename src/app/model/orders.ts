export interface Orders {
    status: string
    code: string
    message: string
    data: OrderData
  }
  
  export interface OrderData {
    datas: OrderItems[]
    totalItems: number
    totalPages: number
    currentPage: number
  }
  
  export interface OrderItems {
    qty: number
    price: number
    subtotal: number
    discount: number
    amount: number
    uuid: string
    order_uuid: string
    name: string
    path: string
    description: string
    status: string
    deliverydate: any
    deliverycharge:any
    rating: string
    orderID: string
    createdAt: string
    slug:string;
    orderitems: Orderitem[]
  }
  
  export interface Orderitem {
    item_uuid: string
    product?: Product
  }
  
  export interface Product {
    path: string
  }


  export  interface ApiResponseData {
    msg: string;
  }
  
  export interface ApiResponse {
    code: string;
    data: ApiResponseData;
    message: string;
    status: string;
  }