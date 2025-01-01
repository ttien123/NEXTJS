import dishApiRequest from "@/apiRequests/dish";
import { getIdFromSlugUrl, wrapServerApi } from "@/lib/utils";
import DishDetail from "./dish-detail";

const DishPage = async ({ params: { slug } }:{params: { slug: string }}) => {
    const id = getIdFromSlugUrl(slug)
    const data = await wrapServerApi(() => dishApiRequest.getDish(Number(id)));
    const dish = data?.payload?.data;
    

    return <DishDetail dish={dish} />
}

export default DishPage;
