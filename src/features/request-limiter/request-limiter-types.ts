import {WithId} from "mongodb";

/*
*
*
*       Request Limiter Type
*
*
*/
export type RequestLimiterMongoViewType = WithId<RequestLimiterInputModelViewType>
export type RequestLimiterInputModelViewType = {
    ip: string,
    url: string,
    date: string,
    quantity: number
}