import dishApiRequest from "@/apiRequests/dish";
import { wrapServerApi } from "@/lib/utils";
import DishDetail from "./dish-detail";

const DishPage = async ({ params: { id } }:{params: { id: string }}) => {
    const data = await wrapServerApi(() => dishApiRequest.getDish(Number(id)));
    const dish = data?.payload?.data;
    

    return <DishDetail dish={dish} />
}

export default DishPage;
