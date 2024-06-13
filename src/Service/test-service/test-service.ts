import { TestRepositories } from "../../Repositories/test-repositories/test-repositories"

export const TestService = {
    async DellAllElements () {
        try {
            await TestRepositories.deleteManyAllData()
        } catch (e: any) {
            throw new Error(e)
        }
    }
}