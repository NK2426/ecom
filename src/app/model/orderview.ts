export interface Root {
    message: string
    data: ViewOrderData
  }
  
  export interface ViewOrderData {
    id: number
    uuid: string
    user_id: number
    orderID: string
    razorpayOrderID: string
    razorpayUniqueID: string
    address_uuid: string
    deliverycharge: number
    name:string
    price:number
    path:string
    codcharge: number
    discount: number
    amount: number
    deliverydate: any
    deliverdate: any
    totalmrp:number
    modeofpayment: string
    paymentStatus: string
    paymentmethod: string
    ship_status: any
    status: string
    cancel_status: any
    createdAt: string
    orderitems: ViewOrderitem[]
    address: Address
    user: User
  }
  
  export interface ViewOrderitem {
    id: number
    uuid: string
    user_id: number
    order_id: number
    order_uuid: string
    orderID: string
    product_id: number
    item_uuid: string
    product: any
    qty: number
    mrp: number
    price: number
    subtotal: number
    discount: number
    taxpercentage: number
    taxtotal: any
    amount: number
    status: string
    createdAt: string
    updatedAt: string
    deliverydate: any
    returndate: any
    refunddate: any
  }
  
  export interface Address {
    id: number
    uuid: string
    user_id: number
    state_id: number
    name: string
    mobile: string
    mobile2: string
    address: string
    email: string
    type: string
    address2: string
    city: string
    state: string
    zipcode: string
    landmark: string
    houseno: string
    isdefault: number
    code: string
  }
  
  export interface User {
    uid: number
    userID: string
    name: string
    image: string
    firstname: string
    lastname: string
    mobile: string
    email: string
  }
  