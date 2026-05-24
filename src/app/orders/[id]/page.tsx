"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ordersService, Order } from "@/service/Orders";
import ReviewModal from "@/components/ReviewModal";

const statusColors: Record<string, string> = {
  NOT_FULFILLED: "bg-yellow-100 text-yellow-800",
  FULFILLED: "bg-green-100 text-green-800",
  PARTIALLY_FULFILLED: "bg-blue-100 text-blue-800",
  CANCELED: "bg-red-100 text-red-800",
  PAID: "bg-green-100 text-green-800",
  NOT_PAID: "bg-red-100 text-red-800",
  PARTIALLY_REFUNDED: "bg-orange-100 text-orange-800",
  FULLY_REFUNDED: "bg-gray-100 text-gray-800",
  PENDING: "bg-yellow-100 text-yellow-800",
};

interface ReviewTarget {
  id: string;
  name: string;
  imageUrl?: string;
}

const OrderPage = () => {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [reviewTarget, setReviewTarget] = useState<ReviewTarget | null>(null);
  const [reviewedIds, setReviewedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    ordersService
      .getOrderById(id)
      .then(setOrder)
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Loading order...</p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500">Order not found.</p>
      </div>
    );
  }

  const billing = order.billingInfo;
  const address = billing?.address;

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Order #{order.number}
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Placed on{" "}
                {new Date(order.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
            <div className="flex gap-3 flex-wrap">
              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColors[order.fulfillmentStatus] ?? "bg-gray-100 text-gray-700"}`}
              >
                {order.fulfillmentStatus.replace(/_/g, " ")}
              </span>
              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColors[order.paymentStatus] ?? "bg-gray-100 text-gray-700"}`}
              >
                {order.paymentStatus.replace(/_/g, " ")}
              </span>
            </div>
          </div>
        </div>

        {/* Line Items */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Items</h2>
          <div className="divide-y divide-gray-200">
            {order.lineItems.map((item, i) => (
              <div key={item.productId ?? i} className="py-4 flex gap-4">
                {item.mediaItem?.src && (
                  <img
                    src={item.mediaItem.src}
                    alt={item.mediaItem.altText ?? item.name}
                    className="w-16 h-16 object-cover rounded bg-slate-100 flex-shrink-0"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 truncate">
                    {item.name}
                  </p>
                  <p className="text-sm text-gray-500 mt-0.5">
                    Qty: {item.quantity}
                  </p>
                  {item.options && item.options.length > 0 && (
                    <p className="text-xs text-gray-400 mt-0.5">
                      {item.options
                        .map((o) => `${o.option}: ${o.selection}`)
                        .join(", ")}
                    </p>
                  )}
                  {item.productId && (
                    <button
                      type="button"
                      onClick={() =>
                        setReviewTarget({
                          id: item.productId,
                          name: item.name,
                          imageUrl: item.mediaItem?.src,
                        })
                      }
                      disabled={reviewedIds.has(item.productId)}
                      className="mt-2 text-xs font-medium text-lama border border-lama rounded-full px-3 py-1 hover:bg-lama hover:text-white transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {reviewedIds.has(item.productId)
                        ? "✓ Reviewed"
                        : "Review Product"}
                    </button>
                  )}
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="font-semibold text-gray-900">
                    $
                    {(
                      (item.totalPrice ?? item.price * item.quantity) ||
                      0
                    ).toFixed(2)}
                  </p>
                  <p className="text-xs text-gray-500">
                    ${(item.price || 0).toFixed(2)} each
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Totals */}
        {order.totals && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Summary
            </h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>${(order.totals.subtotal || 0).toFixed(2)}</span>
              </div>
              {order.totals.shipping !== undefined && (
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span>${(order.totals.shipping || 0).toFixed(2)}</span>
                </div>
              )}
              {order.totals.tax !== undefined && (
                <div className="flex justify-between text-gray-600">
                  <span>Tax</span>
                  <span>${(order.totals.tax || 0).toFixed(2)}</span>
                </div>
              )}
              {order.totals.discount !== undefined &&
                order.totals.discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span>-${(order.totals.discount || 0).toFixed(2)}</span>
                  </div>
                )}
              <div className="flex justify-between font-bold text-gray-900 text-base pt-2 border-t border-gray-200">
                <span>Total</span>
                <span>${(order.totals.total || 0).toFixed(2)}</span>
              </div>
            </div>
          </div>
        )}

        {/* Billing Info */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Billing Info
          </h2>
          <div className="text-sm text-gray-700 space-y-1">
            <p className="font-medium">
              {billing?.firstName} {billing?.lastName}
            </p>
            {billing?.email && <p>{billing.email}</p>}
            {billing?.phone && <p>{billing.phone}</p>}
            {address && (
              <p className="mt-1">
                {address.addressLine}, {address.city}
                {address.subdivision ? `, ${address.subdivision}` : ""}{" "}
                {address.postalCode}, {address.country}
              </p>
            )}
          </div>
        </div>

        {/* Footer Links */}
        <div className="flex gap-4 justify-center text-sm">
          <Link href="/orders" className="text-lama hover:underline">
            View all orders
          </Link>
          <span className="text-gray-300">|</span>
          <Link href="/" className="text-lama hover:underline">
            Have a problem? Contact us
          </Link>
        </div>
      </div>

      {/* Review Modal */}
      {reviewTarget && (
        <ReviewModal
          product={reviewTarget}
          orderId={order._id}
          onClose={() => setReviewTarget(null)}
          onSuccess={() => {
            setReviewedIds((prev) => new Set(prev).add(reviewTarget.id));
          }}
        />
      )}
    </div>
  );
};

export default OrderPage;
