import dishApiRequest from "@/apiRequests/dish";
import { wrapServerApi } from "@/lib/utils";
import Modal from "./modal";
import DishDetail from "@/app/(public)/dishes/[id]/dish-detail";

const DishPage = async ({ params: { id } }:{params: { id: string }}) => {
    const data = await wrapServerApi(() => dishApiRequest.getDish(Number(id)));
    const dish = data?.payload?.data;
    

    return (
        <Modal>
            <DishDetail dish={dish} />
        </Modal>
    )
}

export default DishPage;
