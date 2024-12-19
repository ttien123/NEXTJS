import dishApiRequest from "@/apiRequests/dish";
import { wrapServerApi } from "@/lib/utils";
import Image from "next/image";

const DishPage = async ({ params: { id } }:{params: { id: string }}) => {
    const data = await wrapServerApi(() => dishApiRequest.getDish(Number(id)));
    const dish = data?.payload?.data
    if (!dish) {
        return <div className="text-2xl lg:text-3xl font-semibold">Món ăn không tồn tại</div>
    }
    return (
        <div className="space-y-4">
            <h1 className="text-2xl lg:text-3xl font-semibold">
                {dish.name}
            </h1>
            <div className="font-semibold">
                Giá: {dish.price}
            </div>
            <Image src={dish.image} alt={dish.name} width={700} height={700} className="object-cover w-full h-full max-w-[1080px] max-h-[1080px] rounded-md"/>
            <p>{dish.description}</p>
        </div>
    );
}

export default DishPage;
