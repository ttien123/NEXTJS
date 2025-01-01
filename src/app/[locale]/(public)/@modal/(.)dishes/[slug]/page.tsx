import dishApiRequest from "@/apiRequests/dish";
import { getIdFromSlugUrl, wrapServerApi } from "@/lib/utils";
import Modal from "./modal";
import DishDetail from "../../../dishes/[slug]/dish-detail";

const DishPage = async ({ params: { slug } }: { params: { slug: string } }) => {
  const id = getIdFromSlugUrl(slug)
  const data = await wrapServerApi(() => dishApiRequest.getDish(Number(id)));
  const dish = data?.payload?.data;

  return (
    <Modal>
      <DishDetail dish={dish} />
    </Modal>
  );
};

export default DishPage;
