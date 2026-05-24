"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ordersService, Order } from "@/service/Orders";
import Pagination from "@/components/Pagination";

// ─── Constants ─────────────────────────────────────────────────────────────────

const ORDERS_PER_PAGE = 6;

const FULFILLMENT_OPTIONS = [
  { value: "", label: "All Fulfillment" },
  { value: "NOT_FULFILLED", label: "Not Fulfilled" },
  { value: "PARTIALLY_FULFILLED", label: "Partially Fulfilled" },
  { value: "FULFILLED", label: "Fulfilled" },
  { value: "CANCELED", label: "Canceled" },
];

const PAYMENT_OPTIONS = [
  { value: "", label: "All Payments" },
  { value: "NOT_PAID", label: "Not Paid" },
  { value: "PENDING", label: "Pending" },
  { value: "PAID", label: "Paid" },
  { value: "PARTIALLY_REFUNDED", label: "Partially Refunded" },
  { value: "FULLY_REFUNDED", label: "Fully Refunded" },
];

const fulfillmentColors: Record<string, string> = {
  NOT_FULFILLED: "bg-yellow-100 text-yellow-800",
  FULFILLED: "bg-green-100 text-green-800",
  PARTIALLY_FULFILLED: "bg-blue-100 text-blue-800",
  CANCELED: "bg-red-100 text-red-800",
};

const paymentColors: Record<string, string> = {
  PAID: "bg-green-100 text-green-800",
  NOT_PAID: "bg-red-100 text-red-800",
  PARTIALLY_REFUNDED: "bg-orange-100 text-orange-800",
  FULLY_REFUNDED: "bg-gray-100 text-gray-800",
  PENDING: "bg-yellow-100 text-yellow-800",
};

// ─── Skeleton ──────────────────────────────────────────────────────────────────

const OrderSkeleton = () => (
  <div className="animate-pulse space-y-4">
    {Array.from({ length: 4 }).map((_, i) => (
      <div
        key={i}
        className="bg-white rounded-lg shadow-sm p-5 flex flex-col sm:flex-row gap-4"
      >
        <div className="flex-1 space-y-3">
          <div className="h-4 bg-gray-200 rounded w-1/4" />
          <div className="h-3 bg-gray-200 rounded w-1/3" />
          <div className="h-3 bg-gray-200 rounded w-1/5" />
        </div>
        <div className="flex gap-2 items-start">
          <div className="h-6 w-24 bg-gray-200 rounded-full" />
          <div className="h-6 w-20 bg-gray-200 rounded-full" />
        </div>
      </div>
    ))}
  </div>
);

// ─── Page ──────────────────────────────────────────────────────────────────────

const OrdersPage = () => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fulfillmentFilter = searchParams.get("fulfillment") ?? "";
  const paymentFilter = searchParams.get("payment") ?? "";
  const currentPage = Number(searchParams.get("page") ?? "1");

  // ─── Fetch ────────────────────────────────────────────────────────────────

  useEffect(() => {
    ordersService
      .getMyOrders()
      .then(setOrders)
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  // ─── Filter & Paginate ───────────────────────────────────────────────────

  const filtered = useMemo(() => {
    return orders.filter((o) => {
      const matchFulfillment = fulfillmentFilter
        ? o.fulfillmentStatus === fulfillmentFilter
        : true;
      const matchPayment = paymentFilter
        ? o.paymentStatus === paymentFilter
        : true;
      return matchFulfillment && matchPayment;
    });
  }, [orders, fulfillmentFilter, paymentFilter]);

  const totalPages = Math.ceil(filtered.length / ORDERS_PER_PAGE);
  const paginated = filtered.slice(
    (currentPage - 1) * ORDERS_PER_PAGE,
    currentPage * ORDERS_PER_PAGE,
  );

  // ─── Filter Handlers ─────────────────────────────────────────────────────

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.set("page", "1");
    replace(`${pathname}?${params.toString()}`);
  };

  const clearFilters = () => {
    replace(pathname);
  };

  const hasActiveFilters = fulfillmentFilter || paymentFilter;

  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
          <p className="text-gray-500 mt-1 text-sm">
            Track and manage all your purchases
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6 flex flex-wrap gap-3 items-center">
          <select
            value={fulfillmentFilter}
            onChange={(e) => updateFilter("fulfillment", e.target.value)}
            className="text-sm border border-gray-200 rounded-md px-3 py-2 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-lama focus:border-transparent"
            suppressHydrationWarning
          >
            {FULFILLMENT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>

          <select
            value={paymentFilter}
            onChange={(e) => updateFilter("payment", e.target.value)}
            className="text-sm border border-gray-200 rounded-md px-3 py-2 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-lama focus:border-transparent"
            suppressHydrationWarning
          >
            {PAYMENT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>

          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="text-sm text-lama hover:underline ml-auto"
            >
              Clear filters
            </button>
          )}

          {!loading && (
            <span className="text-sm text-gray-400 ml-auto">
              {filtered.length} order{filtered.length !== 1 ? "s" : ""}
            </span>
          )}
        </div>

        {/* Content */}
        {loading ? (
          <OrderSkeleton />
        ) : error ? (
          <div className="text-center py-20">
            <p className="text-red-500 text-sm">
              Failed to load orders. Please try again later.
            </p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500 text-sm">
              {hasActiveFilters
                ? "No orders match the selected filters."
                : "You have no orders yet."}
            </p>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="mt-3 text-sm text-lama hover:underline"
              >
                Clear filters
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="space-y-4">
              {paginated.map((order) => {
                const itemCount = order.lineItems.reduce(
                  (sum, item) => sum + item.quantity,
                  0,
                );
                const firstImage = order.lineItems.find((i) => i.mediaItem?.src)
                  ?.mediaItem?.src;

                return (
                  <Link
                    key={order._id}
                    href={`/orders/${order._id}`}
                    className="block bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-5"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                      {/* Thumbnail */}
                      {firstImage && (
                        <div className="w-16 h-16 relative flex-shrink-0 hidden sm:block">
                          <Image
                            src={firstImage}
                            alt="Order thumbnail"
                            fill
                            className="object-cover rounded-md bg-gray-100"
                          />
                        </div>
                      )}

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-semibold text-gray-900">
                            Order #{order.number}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 mt-0.5">
                          {new Date(order.createdAt).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            },
                          )}
                          {" · "}
                          {itemCount} item{itemCount !== 1 ? "s" : ""}
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5 truncate">
                          {order.lineItems
                            .slice(0, 2)
                            .map((i) => i.name)
                            .join(", ")}
                          {order.lineItems.length > 2 &&
                            ` +${order.lineItems.length - 2} more`}
                        </p>
                      </div>

                      {/* Right side */}
                      <div className="flex flex-row sm:flex-col items-center sm:items-end gap-2 sm:gap-1 flex-shrink-0">
                        <span className="text-base font-bold text-gray-900">
                          ${(order.totals?.total ?? 0).toFixed(2)}{" "}
                          <span className="text-xs font-normal text-gray-400">
                            {order.currency}
                          </span>
                        </span>
                        <div className="flex gap-2 flex-wrap justify-end">
                          <span
                            className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                              fulfillmentColors[order.fulfillmentStatus] ??
                              "bg-gray-100 text-gray-700"
                            }`}
                          >
                            {order.fulfillmentStatus.replace(/_/g, " ")}
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                              paymentColors[order.paymentStatus] ??
                              "bg-gray-100 text-gray-700"
                            }`}
                          >
                            {order.paymentStatus.replace(/_/g, " ")}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                hasPrev={currentPage > 1}
                hasNext={currentPage < totalPages}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default OrdersPage;
