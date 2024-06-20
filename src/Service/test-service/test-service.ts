import { TestRepositories } from "../../Repositories/test-repositories/test-repositories"

export const TestService = {
    async DellAllElements () {
        try {
            return await TestRepositories.deleteManyAllData()
        } catch (e: any) {
            throw new Error(e)
        }
    }
}