export interface BaseResponse {
    success: boolean
    data: any
    message: string
}

export interface BaseInput {
    fileURL: string,
}


export interface BaseErr {
    code: number
    message: string
}


export interface IWithTimestamps {
    createdAt?: Date;
    updatedAt?: Date;
}