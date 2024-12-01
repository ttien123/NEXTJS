"use client";

import { Badge } from "@/components/ui/badge";
import { formatCurrency, getVietnameseOrderStatus } from "@/lib/utils";
import { useGuestGetOrderListQuery } from "@/queries/useGuest";
import Image from "next/image";
import { useMemo } from "react";

const OrdersCart = () => {
  const { data } = useGuestGetOrderListQuery();
  const orders = useMemo(() => data?.payload.data ?? [], [data]);

  const totalPrice = useMemo(() => {
    return orders.reduce((result, order) => {
      return result + order.dishSnapshot.price * order.quantity;
    }, 0);
  }, [orders]);
  return (
    <>
      {orders.map((order, index) => (
        <div key={order.id} className="flex gap-4">
          <div className="text-sm font-semibold">{index + 1}.</div>
          <div className="flex-shrink-0 relative">
            <Image
              src={order.dishSnapshot.image}
              alt={order.dishSnapshot.name}
              height={100}
              width={100}
              quality={100}
              className="object-cover w-[80px] h-[80px] rounded-md"
            />
          </div>
          <div className="space-y-1">
            <h3 className="text-sm">{order.dishSnapshot.name}</h3>
            <div className="flex-shrink-0 ml-auto flex justify-center items-center">
              <p className="text-sm font-semibold">
                {formatCurrency(order.dishSnapshot.price)} x{" "}
                <Badge>{order.quantity}</Badge>
              </p>
            </div>
            <div className="flex-shrink-0 ml-auto flex items-center">
                {getVietnameseOrderStatus(order.status)}
            </div>
          </div>
        </div>
      ))}
      <div className="sticky bottom-0">
        <div className="w-full justify-between text-xl font-semibold">
          <span className="mr-3">Giá tiền · {orders.length} món</span>
          <span>{formatCurrency(totalPrice)}</span>
        </div>
      </div>
    </>
  );
};

export default OrdersCart;
