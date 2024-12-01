import React from "react";
import OrdersCart from "./order-cart";

const OrderPage = () => {
  return (
    <div className="max-w-[400px] mx-auto space-y-4">
      <h1 className="text-center text-xl font-bold">Đơn hàng</h1>
      <OrdersCart />
    </div>
  );
};

export default OrderPage;
