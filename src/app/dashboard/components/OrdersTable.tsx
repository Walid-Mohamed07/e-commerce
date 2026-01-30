"use client";

import React, { useState, useMemo, useEffect } from "react";
import { fetchOrders, Order } from "@/service/api/orders";
import Skeleton from "@/components/Skeleton";

const ITEMS_PER_PAGE = 5;

const OrdersTable = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [filter, setFilter] = useState("All");
  useEffect(() => {
    const getOrders = async () => {
      setLoading(true);
      try {
        const data = await fetchOrders();
        setOrders(data);
      } catch (err) {
        // Optionally handle error
      } finally {
        setLoading(false);
      }
    };
    getOrders();
  }, []);

  const handleStatusChange = (id: string, status: "Accepted" | "Rejected") => {
    setOrders(
      orders.map((order) => (order.id === id ? { ...order, status } : order)),
    );
  };

  const filteredOrders = useMemo(() => {
    if (filter === "All") {
      return orders;
    }
    return orders.filter((order) => order.status === filter);
  }, [orders, filter]);

  const paginatedOrders = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredOrders.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredOrders, currentPage]);

  const totalPages = Math.ceil(filteredOrders.length / ITEMS_PER_PAGE);

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      {loading ? (
        <Skeleton />
      ) : (
        <>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">All Orders</h2>
            <div className="flex items-center space-x-2">
              <span className="text-sm">Filter by status:</span>
              <select
                value={filter}
                onChange={(e) => {
                  setFilter(e.target.value);
                  setCurrentPage(1); // Reset to first page on filter change
                }}
                className="border rounded-md px-2 py-1"
              >
                <option value="All">All</option>
                <option value="Pending">Pending</option>
                <option value="Accepted">Accepted</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>
          </div>
          <table className="w-full text-sm text-left text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3">
                  Order ID
                </th>
                <th scope="col" className="px-6 py-3">
                  Customer
                </th>
                <th scope="col" className="px-6 py-3">
                  Date
                </th>
                <th scope="col" className="px-6 py-3">
                  Total
                </th>
                <th scope="col" className="px-6 py-3">
                  Status
                </th>
                <th scope="col" className="px-6 py-3">
                  Delivery State
                </th>
                <th scope="col" className="px-6 py-3">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedOrders.map((order) => (
                <tr key={order.id} className="bg-white border-b">
                  <td className="px-6 py-4">{order.id}</td>
                  <td className="px-6 py-4">
                    {order.user?.username || order.user?.email || "-"}
                  </td>
                  <td className="px-6 py-4">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    ${Number(order.totalPrice).toFixed(2)}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        order.status === "pending"
                          ? "bg-yellow-200 text-yellow-800"
                          : order.status === "accepted"
                            ? "bg-green-200 text-green-800"
                            : "bg-red-200 text-red-800"
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 rounded text-xs bg-gray-100 text-gray-700">
                      {order.deliveryState}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="text-blue-600 hover:text-blue-900 border px-2 py-1 rounded"
                      >
                        View details
                      </button>
                      {order.status === "pending" && (
                        <>
                          <button
                            onClick={() =>
                              handleStatusChange(order.id, "accepted")
                            }
                            className="text-green-600 hover:text-green-900"
                          >
                            Accept
                          </button>
                          <button
                            onClick={() =>
                              handleStatusChange(order.id, "rejected")
                            }
                            className="text-red-600 hover:text-red-900"
                          >
                            Reject
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                  {/* Order Details Modal */}
                  {selectedOrder && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
                      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg relative">
                        <button
                          className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-xl"
                          onClick={() => setSelectedOrder(null)}
                          aria-label="Close"
                        >
                          &times;
                        </button>
                        <h3 className="text-xl font-bold mb-4">Order Items</h3>
                        <div className="space-y-4">
                          {selectedOrder.items &&
                          selectedOrder.items.length > 0 ? (
                            selectedOrder.items.map(
                              (item: any, idx: number) => (
                                <div key={idx} className="border-b pb-3">
                                  <div className="font-semibold text-gray-900">
                                    {item.productName}
                                  </div>
                                  <div className="text-sm text-gray-600">
                                    {item.productDescription}
                                  </div>
                                  <div className="text-sm text-gray-600">
                                    Qty: {item.quantity}
                                  </div>
                                  <div className="text-sm text-gray-600">
                                    Price: ${Number(item.price).toFixed(2)}
                                  </div>
                                  <div className="text-sm text-gray-600">
                                    Subtotal: $
                                    {Number(item.subtotal).toFixed(2)}
                                  </div>
                                </div>
                              ),
                            )
                          ) : (
                            <div className="text-gray-500">
                              No items found for this order.
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex justify-between items-center mt-4">
            <span className="text-sm text-gray-700">
              Showing {paginatedOrders.length} of {filteredOrders.length}{" "}
              results
            </span>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 border rounded-md disabled:opacity-50"
              >
                Previous
              </button>
              <span>
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className="px-3 py-1 border rounded-md disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default OrdersTable;
