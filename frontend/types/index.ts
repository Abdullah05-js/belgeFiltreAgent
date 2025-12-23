export interface File {
    id: string;
    name: string;
    size: number;
    uploadedAt: string;
}

export interface IFileUpload {
    keys: File[],
}

export interface IFileUploadResponse {
    links: string[],
}