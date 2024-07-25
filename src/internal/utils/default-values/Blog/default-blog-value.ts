

export const defaultBlogValues = {
    async defaultCreateValues () {
        return {
            createdAt: new Date().toISOString(),
            isMembership: false
        }
    },
}