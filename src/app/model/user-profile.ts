export interface UserProfile {
    name: string
    firstname: string
    lastname: string
    mobile: string
    email: string
    createdAt: string
    image: string
    supercoins: number
    specialcoins: number
    referralcode: string
    getcoins: number
    freeshipamount: number
    linkcontent: string
    earnedcoins: number
}


export interface UserProfileHttpResponse {
    status: string
    code: string
    message: string
    data: UserProfile
}