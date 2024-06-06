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

export type BlogCreatingType = BlogInputType & {
    createdAt: string,
    isMembership: boolean
}

export type BlogsResponseType = {
    status: number,
    elements: BlogsViewType | null
}

export type BlogResponseType = {
    status: number,
    elements: BlogViewType | null
}



