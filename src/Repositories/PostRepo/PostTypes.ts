export type PostsViewType = PostViewType[]

export type PostViewType = {
    id: string,
    title: string,
    shortDescription: string,
    content: string,
    blogId: string,
    blogName: string,
    createdAt: string
}

export type PostInputType = {
    title: string,
    shortDescription: string,
    content: string,
    blogId: string
}

export type PostsResponseType = {
    status: number,
    message: string,
    elements: PostsViewType | null
}

export type PostResponseType = {
    status: number,
    message: string,
    elements: PostViewType | null
}