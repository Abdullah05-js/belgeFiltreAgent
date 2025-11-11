export interface BaseResponse {
    success: boolean
    data: ""
    error: Error | null
}

export interface BaseInput {
    fileURL: string,
}