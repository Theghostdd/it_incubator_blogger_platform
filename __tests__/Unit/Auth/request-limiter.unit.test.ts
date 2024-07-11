
import { addSeconds } from "date-fns";
import { AuthRepositories } from "../../../src/Repositories/AuthRepositories/AuthRepositories";
import { AuthService } from "../../../src/Service/AuthService/AuthService"
import { AuthDto } from "../../Dto/AuthDto"
import { ResultNotificationEnum } from "../../../src/Applications/Types-Models/BasicTypes";

const RequestLimiterService = AuthService.RequestLimiter

describe('Request limiter', () => {
    let RequestLimiterData: any;
    beforeEach (() => {
        RequestLimiterData = AuthDto.RequestData
    })

    it('should add new request, status: Success', async () => {
        AuthRepositories.GetUsersRequestByIpAndUrl = jest.fn().mockImplementation(() => false)
        AuthRepositories.AddRequest = jest.fn().mockImplementation(() => true)
    
        const result = await RequestLimiterService(RequestLimiterData)
        expect(result.status).toBe(ResultNotificationEnum.Success)
    }) 

    it('should not skip request, timestamp request more last request timestamp and quantity request 5, status: BadRequest', async () => {
        AuthRepositories.GetUsersRequestByIpAndUrl = jest.fn().mockImplementation(() => {
            return {
                date: addSeconds(new Date().toISOString(), 10),
                quantity: 5
            }
        })
        const result = await RequestLimiterService(RequestLimiterData)
        expect(result.status).toBe(ResultNotificationEnum.BadRequest)

       

    }) 
})


// _id: "66632242575d379aaed930d7",
