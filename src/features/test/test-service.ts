import {iTestRepositories, iTestService} from "./test-interface";
import {inject, injectable} from "inversify";
import "reflect-metadata";
import {TestRepositories} from "./test-repositories";

@injectable()
export class TestService implements iTestService {
    constructor(
        @inject(TestRepositories) protected testRepositories: iTestRepositories
    ) {}
    async clearAllDb (): Promise<void> {
        try {
            return await this.testRepositories.deleteManyAllData()
        } catch (e: any) {
            throw new Error(e)
        }
    }
}

