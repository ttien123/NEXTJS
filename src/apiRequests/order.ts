import http from "@/lib/http";
import { GetOrdersQueryParamsType, GetOrdersResType, UpdateOrderBodyType, UpdateOrderResType } from "@/schemaValidations/order.schema";
import queryString from 'query-string'
const orderApiRequest = {
    getOrderList: (queryParams: GetOrdersQueryParamsType) => http.get<GetOrdersResType>("/orders?" + queryString.stringify({
        fromDate: queryParams.fromDate?.toISOString(),
        toDate: queryParams.toDate?.toISOString()
    })),
    updateOrder: (orderId: number, body: UpdateOrderBodyType) => http.put<UpdateOrderResType>(`/orders/${orderId}`, body),
    getOrderDetail: (orderId: number) => http.get(`/orders/${orderId}`),
}

export default orderApiRequest