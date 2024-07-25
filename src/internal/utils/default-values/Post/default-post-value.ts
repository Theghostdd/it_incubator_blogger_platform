export const defaultPostValues = {
    defaultCreateValues (blogName: string) {
        return {
            createdAt: new Date().toISOString(),
            blogName: blogName
        }
    },
}