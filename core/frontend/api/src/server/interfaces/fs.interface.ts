import mime from "mime";

export interface FsResponse {
    type: string
    content_length: number
    content_type: string
    data: number[]
}