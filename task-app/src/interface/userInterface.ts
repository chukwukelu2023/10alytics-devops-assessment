export interface IUser {
    id:number
    userId ?: number
    firstName?: string
    lastName?: string
    email?: string
    password: string
    isAdmin?: boolean
}

export interface loginUser {
    email: string,
    password: string
}

export interface IPayload{
    id: number,
    admin?: boolean
}