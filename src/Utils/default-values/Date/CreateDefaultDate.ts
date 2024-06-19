
export const CreateDefaultValueDate = {
    async DefaultNowDate (): Promise<string> {
        return new Date().toISOString()
    }
}