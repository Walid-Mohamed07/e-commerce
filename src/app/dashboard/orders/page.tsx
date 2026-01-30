import React from 'react';
import OrdersTable from '../components/OrdersTable';

const OrdersPage = () => {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Orders</h1>
      <OrdersTable />
    </div>
  );
};

export default OrdersPage;
