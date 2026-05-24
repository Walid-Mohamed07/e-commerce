"use client";

import Image from "next/image";
import { useEffect } from "react";
import Link from "next/link";
import { useCartStore } from "@/hooks/useCartStore";
import ErrorToast from "@/components/Toast/ErrorToast";
import { CartItemProduct } from "@/features/product/services/cart";

const getProductId = (product: CartItemProduct | string): string => {
  if (typeof product === "string") return product;
  return product._id ?? "";
};

const getProductName = (product: CartItemProduct | string): string => {
  if (typeof product === "string") return "Product";
  return product.name ?? "Product";
};

const getProductImage = (product: CartItemProduct | string): string | null => {
  if (typeof product === "string") return null;
  return (
    product.media?.mainMedia?.image?.url ||
    product.media?.mainMedia?.thumbnail?.url ||
    product.media?.items?.[0]?.image?.url ||
    null
  );
};

const CartModal = () => {
  const { cart, isLoading: loading, error, fetchCart, removeItem } = useCartStore();

  // Fetch cart on component mount
  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const handleRemoveItem = async (product: CartItemProduct | string) => {
    try {
      await removeItem(getProductId(product));
    } catch (err) {
      console.error("Failed to remove item:", err);
    }
  };

  const handleCheckout = () => {
    // Checkout is handled via the Proceed to Checkout button on checkout page
    window.location.href = "/checkout";
  };

  const isEmpty = !cart || !cart.items || cart.items.length === 0;

  return (
    <div className="w-max absolute p-4 rounded-md shadow-[0_3px_10px_rgb(0,0,0,0.2)] bg-white top-12 right-0 flex flex-col gap-6 z-20">
      {isEmpty ? (
        <div className="text-gray-600">Cart is Empty</div>
      ) : (
        <>
          <h2 className="text-xl font-semibold">Shopping Cart</h2>

          {error && (
            <div className="mb-4">
              <ErrorToast errorMsg={error} />
            </div>
          )}

          {/* LIST */}
          <div className="flex flex-col gap-8 max-h-96 overflow-y-auto">
            {/* ITEMS */}
            {cart &&
              cart.items &&
              cart.items.length > 0 &&
              cart.items.map((item) => {
                const imgUrl = getProductImage(item.product);
                return (
                <div className="flex gap-4" key={getProductId(item.product)}>
                  {/* IMAGE */}
                  {imgUrl && (
                    <div className="relative w-16 h-16 flex-shrink-0">
                      <Image
                        src={imgUrl}
                        alt={getProductName(item.product)}
                        fill
                        className="object-contain rounded bg-slate-100"
                      />
                    </div>
                  )}
                  <div className="flex flex-col justify-between w-full">
                    {/* TOP */}
                    <div className="">
                      {/* TITLE */}
                      <div className="flex items-center justify-between gap-8">
                        <h3 className="font-semibold text-sm">
                          {getProductName(item.product)}
                        </h3>
                        <div className="p-1 bg-gray-50 rounded-sm flex items-center gap-2 text-sm">
                          {item.quantity && item.quantity > 1 && (
                            <div className="text-xs text-green-500">
                              {item.quantity}x
                            </div>
                          )}
                          ${(Number(item.price) || 0).toFixed(2)}
                        </div>
                      </div>
                      {/* DESC */}
                      <div className="text-xs text-gray-500 mt-1">
                        ID: {getProductId(item.product).substring(0, 8)}...
                      </div>
                    </div>
                    {/* BOTTOM */}
                    <div className="flex justify-between text-sm mt-2">
                      <span className="text-gray-500">
                        Qty. {item.quantity}
                      </span>
                      <button
                        onClick={() => handleRemoveItem(item.product)}
                        disabled={loading}
                        className="text-blue-500 hover:text-blue-700 disabled:text-gray-400 disabled:cursor-not-allowed"
                      >
                        {loading ? "Removing..." : "Remove"}
                      </button>
                    </div>
                  </div>
                </div>
                );
              })}
          </div>

          {/* BOTTOM */}
          <div className="">
            <div className="flex items-center justify-between font-semibold">
              <span className="">Total Price</span>
              <span className="">
                ${(Number(cart?.totalPrice) || 0).toFixed(2)}
              </span>
            </div>
            {cart?.tax !== undefined && (
              <div className="flex items-center justify-between text-sm text-gray-600 mt-1">
                <span>Tax</span>
                <span>${(Number(cart.tax) || 0).toFixed(2)}</span>
              </div>
            )}
            {cart?.shipping !== undefined && (
              <div className="flex items-center justify-between text-sm text-gray-600">
                <span>Shipping</span>
                <span>${(Number(cart.shipping) || 0).toFixed(2)}</span>
              </div>
            )}
            {cart?.total !== undefined && (
              <div className="flex items-center justify-between font-semibold text-lg mt-2 pt-2 border-t">
                <span>Total</span>
                <span>${(Number(cart.total) || 0).toFixed(2)}</span>
              </div>
            )}
            <p className="text-gray-500 text-xs mt-2 mb-4">
              Shipping and taxes calculated at checkout.
            </p>
            <div className="flex justify-between text-sm gap-2">
              <Link
                href="/list"
                className="rounded-md py-3 px-4 ring-1 ring-gray-300 text-center hover:bg-gray-50 transition"
              >
                Continue Shopping
              </Link>
              <button
                className="rounded-md py-3 px-4 bg-blue-600 text-white disabled:cursor-not-allowed disabled:opacity-75 hover:bg-blue-700 transition"
                disabled={loading || isEmpty}
                onClick={handleCheckout}
              >
                Checkout
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CartModal;
