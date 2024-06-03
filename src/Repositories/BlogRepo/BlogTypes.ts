
export type BlogsViewType = BlogViewType[]

export type BlogViewType = {
    id: string,
    name: string,
    description: string,
    websiteUrl:	string,
    createdAt: string,
    isMembership: boolean
}

export type BlogInputType = {
    name: string,
    description: string,
    websiteUrl:	string
}

export type BlogsResponseType = {
    status: number,
    message: string,
    elements: BlogsViewType | null
}

export type BlogResponseType = {
    status: number,
    message: string,
    elements: BlogViewType | null
}

