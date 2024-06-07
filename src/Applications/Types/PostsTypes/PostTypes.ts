export type PostsViewType = {
    pagesCount: number,
    page: number,
    pageSize: number,
    totalCount: number,
    items: PostViewType[]
}

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

export type PostCreateType = PostInputType & {
    blogName: string,
    createdAt: string
}

export type PostsResponseType = {
    status: number,
    elements: PostsViewType | null
}

export type PostResponseType = {
    status: number,
    elements: PostViewType | null
}


export type PostQueryRequestType = {
    pageNumber?: number,
    pageSize?: number,
    sortBy?: string,
    sortDirection?: string
}