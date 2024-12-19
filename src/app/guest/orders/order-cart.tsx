"use client";

import { useAppStore } from "@/components/app-provider";
import { Badge } from "@/components/ui/badge";
import { OrderStatus } from "@/constants/type";
import { toast } from "@/hooks/use-toast";
import { formatCurrency, getVietnameseOrderStatus } from "@/lib/utils";
import { useGuestGetOrderListQuery } from "@/queries/useGuest";
import { PayGuestOrdersResType, UpdateOrderResType } from "@/schemaValidations/order.schema";
import Image from "next/image";
import { useEffect, useMemo } from "react";

const OrdersCart = () => {
  const { data, refetch } = useGuestGetOrderListQuery();
  const orders = useMemo(() => data?.payload.data ?? [], [data]);
  const socket = useAppStore(state => state.socket)
  const { waitingForPaying, paid } = useMemo(() => {
    
    return orders.reduce((result, order) => {
      if (order.status === OrderStatus.Delivered || order.status === OrderStatus.Processing || order.status === OrderStatus.Pending) {
        return {
          ...result,
          waitingForPaying: {
            price: result.waitingForPaying.price + order.dishSnapshot.price * order.quantity,
            quantity: result.waitingForPaying.quantity + order.quantity
          }
        }
      }
      if (order.status === OrderStatus.Paid) {
        return {
          ...result,
          paid: {
            price: result.paid.price + order.dishSnapshot.price * order.quantity,
            quantity: result.paid.quantity + order.quantity
          }
        }
      }

      return result
    }, {
      waitingForPaying: {
        price: 0,
        quantity: 0
      },
      paid: {
        price: 0,
        quantity: 0
      }
    });
  }, [orders]);

  useEffect(() => {
    if (socket?.connected) {
      onConnect();
    }

    function onConnect() {}

    function onDisconnect() {}
    function onUpdateOrder(data: UpdateOrderResType['data']) {
        const { dishSnapshot: { name }, quantity } = data
        toast({
          description: `Món ${name} (SL: ${quantity}) vừa được cập nhật sang trạng thái "${getVietnameseOrderStatus(data.status)}"`
        })
        refetch()
    }

    function onPayment(data: PayGuestOrdersResType['data']) {
      const { guest } = data[0]
      toast({
        description: `${guest?.name} tại bàn ${guest?.tableNumber} thanh toán được ${data.length} đơn`
      })
      refetch()
  }

    socket?.on("update-order", onUpdateOrder);
    socket?.on("connect", onConnect);
    socket?.on("disconnect", onDisconnect);
    socket?.on("payment", onPayment);

    return () => {
      socket?.off("connect", onConnect);
      socket?.off("update-order", onUpdateOrder);
      socket?.off("disconnect", onDisconnect);
      socket?.off("payment", onPayment);
    };
  }, [refetch, socket]);
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
      {paid.quantity !== 0 && <div className="sticky bottom-0">
        <div className="w-full justify-between text-xl font-semibold">
          <span className="mr-3">Đơn đã thanh toán · {paid.quantity} món</span>
          <span>{formatCurrency(paid.price)}</span>
        </div>
      </div>}
      <div className="sticky bottom-0">
        <div className="w-full justify-between text-xl font-semibold">
          <span className="mr-3">Đơn chưa thanh toán · {waitingForPaying.quantity} món</span>
          <span>{formatCurrency(waitingForPaying.price)}</span>
        </div>
      </div>
    </>
  );
};

export default OrdersCart;
