import {iTestRepositories, iTestService} from "./test-interface";


export class TestService implements iTestService {
    constructor(protected testRepositories: iTestRepositories) {}
    async clearAllDb (): Promise<void> {
        try {
            return await this.testRepositories.deleteManyAllData()
        } catch (e: any) {
            throw new Error(e)
        }
    }
}

