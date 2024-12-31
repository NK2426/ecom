export class Root {
    status?: string
    code?: string
    message?: string
    data?: Data
}

export class Data {
    name?: string
    menus?: Menu[]
}

export class Menu {
    cid?: number
    uuid?: string
    name?: string
    name_ta?: string
    image?: string
    icon?: string
    description?: string
    groups?: Group[]
}

export class Group {
    uuid?: string
    name?: string
    name_ta?: string
    image?: string
    icon?: string
    description?: string
}
