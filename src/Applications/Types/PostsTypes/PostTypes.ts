export type PostsViewType = {
    pagesCount: number,
    page: number,
    pageSize: number,
    totalCount: number,
    item: PostViewType[]
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

export type PostFilterType = {
    pagination: PostPaginationType,
    sort: PostSortType
}

type PostPaginationType = {
    totalCount: number,
    pagesCount: number,
    skip: number,
    pageSize: number,
    page: number
}

type PostSortType = {
    sortBy: string,
    sortDirection: number
}

export type PostQueryRequestType = {
    pageNumber: number,
    pageSize: number,
    sortBy: string,
    sortDirection: string
}