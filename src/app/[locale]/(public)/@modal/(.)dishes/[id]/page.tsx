import dishApiRequest from "@/apiRequests/dish";
import { wrapServerApi } from "@/lib/utils";
import Modal from "./modal";
import DishDetail from "../../../dishes/[id]/dish-detail";

const DishPage = async (props:{params: Promise<{ id: string }>}) => {
    const params = await props.params;

    const {
        id
    } = params;

    const data = await wrapServerApi(() => dishApiRequest.getDish(Number(id)));
    const dish = data?.payload?.data;


    return (
        <Modal>
            <DishDetail dish={dish} />
        </Modal>
    )
}

export default DishPage;
