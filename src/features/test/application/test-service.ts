import {inject, injectable} from "inversify";
import {TestRepositories} from "../infrastructure/test-repositories";

@injectable()
export class TestService {
    constructor(
        @inject(TestRepositories) protected testRepositories: TestRepositories
    ) {}
    async clearAllDb (): Promise<void> {
        try {
            return await this.testRepositories.deleteManyAllData()
        } catch (e: any) {
            throw new Error(e)
        }
    }
}

