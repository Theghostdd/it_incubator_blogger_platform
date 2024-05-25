/*
*
*   Blogs 
*
*/
export type BlogsViewType = BlogViewType[]

export type BlogViewType = {
    id:	string,
    name: string,
    description: string,
    websiteUrl:	string
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
/*
*
*   Posts 
*
*/
export type PostsViewType = PostViewType[]

export type PostViewType = {
    id: string,
    title: string,
    shortDescription: string,
    content: string,
    blogId: string,
    blogName: string
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
/*
*
*   Tests 
*
*/
export type InspectType = {
    
}
/*
*
*   Request 
*
*/
export type RequestParamsType = {
    id: string
}
/*
*
*   Response 
*
*/
export type GetResponse = BlogViewType | PostViewType

export type GetAllResponse = BlogsViewType | PostsViewType

export type StatusResponse = {
    status: number
}

