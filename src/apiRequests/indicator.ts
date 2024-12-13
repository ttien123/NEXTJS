import http from "@/lib/http";
import { DashboardIndicatorQueryParamsType, DashboardIndicatorResType } from "@/schemaValidations/indicator.schema";
import queryString from "query-string";

const indicatorApiRequest = {
    getDashboardIndicators: (query: DashboardIndicatorQueryParamsType) => http.get<DashboardIndicatorResType>("/indicators/dashboard?" + 
        queryString.stringify({
            fromDate: query.fromDate?.toISOString(),
            toDate: query.toDate?.toISOString()
        }))
    
}

export default indicatorApiRequest