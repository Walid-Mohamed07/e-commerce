"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { cartService, CheckoutPayload } from "@/features/product/services/cart";
import SuccessToast from "@/components/Toast/SuccessToast";
import ErrorToast from "@/components/Toast/ErrorToast";
import Link from "next/link";
import useCart from "@/hooks/useCart";
import Image from "next/image";

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, loading: cartLoading, fetchCart } = useCart();

  const [formData, setFormData] = useState({
    shippingAddress: "",
    phoneNumber: "",
    shippingNotes: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // Fetch cart on mount
  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validation
    if (!formData.shippingAddress.trim()) {
      setMessage({ type: "error", text: "Shipping address is required" });
      return;
    }

    if (!formData.phoneNumber.trim()) {
      setMessage({ type: "error", text: "Phone number is required" });
      return;
    }

    setLoading(true);

    try {
      const payload: CheckoutPayload = {
        shippingAddress: formData.shippingAddress,
        phoneNumber: formData.phoneNumber,
        shippingNotes: formData.shippingNotes || undefined,
      };

      const response = await cartService.checkout(payload);

      setMessage({
        type: "success",
        text: "Order placed successfully!",
      });

      // Redirect to success page after 2 seconds
      setTimeout(() => {
        router.push("/success");
      }, 2000);
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to place order";
      setMessage({
        type: "error",
        text: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 pt-24 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Form - Left Side */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-md p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
            <p className="text-gray-600 mt-2">
              Complete your purchase by providing shipping details
            </p>
          </div>

          {/* Messages */}
          {message && (
            <div className="mb-6">
              {message.type === "success" ? (
                <SuccessToast successMsg={message.text} />
              ) : (
                <ErrorToast errorMsg={message.text} />
              )}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Shipping Address */}
            <div>
              <label
                htmlFor="shippingAddress"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Shipping Address
              </label>
              <input
                type="text"
                id="shippingAddress"
                name="shippingAddress"
                value={formData.shippingAddress}
                onChange={handleInputChange}
                placeholder="e.g., 123 Main St, City, Country"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                disabled={loading}
              />
              <p className="text-gray-500 text-xs mt-1">
                Enter your complete shipping address
              </p>
            </div>

            {/* Phone Number */}
            <div>
              <label
                htmlFor="phoneNumber"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Phone Number
              </label>
              <input
                type="tel"
                id="phoneNumber"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                placeholder="e.g., +1-234-567-8900"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                disabled={loading}
              />
              <p className="text-gray-500 text-xs mt-1">
                Include country code for international numbers
              </p>
            </div>

            {/* Shipping Notes */}
            <div>
              <label
                htmlFor="shippingNotes"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Shipping Notes (Optional)
              </label>
              <textarea
                id="shippingNotes"
                name="shippingNotes"
                value={formData.shippingNotes}
                onChange={handleInputChange}
                placeholder="e.g., Leave at door, ring doorbell, etc."
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition resize-none"
                disabled={loading}
              />
              <p className="text-gray-500 text-xs mt-1">
                Add any special delivery instructions
              </p>
            </div>

            {/* Form Actions */}
            <div className="flex gap-4 pt-6">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-lama hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
              >
                {loading ? "Processing..." : "Place Order"}
              </button>
              <Link
                href="/list"
                className="flex-1 text-center bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded-lg transition duration-200"
              >
                Continue Shopping
              </Link>
            </div>
          </form>

          {/* Security Notice */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-gray-600 text-sm text-center">
              ✓ Your payment information is secure and encrypted
            </p>
          </div>
        </div>

        {/* Order Summary - Right Side */}
        <div className="bg-white rounded-lg shadow-md p-6 h-fit">
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            Order Summary
          </h2>

          {/* Loading Skeleton */}
          {cartLoading ? (
            <div className="space-y-4 animate-pulse">
              {/* Skeleton Items */}
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="flex gap-3 pb-4 border-b border-gray-200"
                >
                  {/* Skeleton Image */}
                  <div className="w-20 h-20 bg-gray-200 rounded flex-shrink-0" />

                  {/* Skeleton Details */}
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4" />
                    <div className="h-3 bg-gray-200 rounded w-1/2" />
                    <div className="h-4 bg-gray-200 rounded w-2/3" />
                    <div className="h-3 bg-gray-200 rounded w-3/5" />
                  </div>
                </div>
              ))}

              {/* Skeleton Total Section */}
              <div className="space-y-2 pt-4 border-t border-gray-200">
                <div className="flex justify-between">
                  <div className="h-3 bg-gray-200 rounded w-1/3" />
                  <div className="h-3 bg-gray-200 rounded w-1/4" />
                </div>
                <div className="flex justify-between">
                  <div className="h-3 bg-gray-200 rounded w-1/3" />
                  <div className="h-3 bg-gray-200 rounded w-1/4" />
                </div>
                <div className="flex justify-between pt-2 border-t border-gray-200">
                  <div className="h-4 bg-gray-200 rounded w-1/4" />
                  <div className="h-4 bg-gray-200 rounded w-1/5" />
                </div>
              </div>
            </div>
          ) : cart && cart.items && cart.items.length > 0 ? (
            <>
              <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
                {cart.items.map((item) => (
                  <div
                    key={item.productId}
                    className="flex gap-3 pb-4 border-b border-gray-200"
                  >
                    {/* Item Image */}
                    {item.productImage && (
                      <div className="relative w-20 h-20 flex-shrink-0">
                        <Image
                          src={item.productImage}
                          alt={item.productName || "Product"}
                          fill
                          className="object-cover rounded"
                        />
                      </div>
                    )}

                    {/* Item Details */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-sm text-gray-900 truncate">
                        {item.productName || "Product"}
                      </h3>
                      <p className="text-xs text-gray-500 mt-1">
                        Qty: {item.quantity}
                      </p>
                      <p className="text-sm font-semibold text-gray-900 mt-2">
                        ${(Number(item.price) || 0).toFixed(2)} each
                      </p>
                      <p className="text-xs text-lama font-medium">
                        Subtotal: ${(Number(item.subtotal) || 0).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Total */}
              <div className="space-y-2 pt-4 border-t border-gray-200">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Tax:</span>
                  <span>${(Number(cart.tax) || 0).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Shipping:</span>
                  <span>${(Number(cart.shipping) || 0).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-lg font-bold text-gray-900 pt-2 border-t border-gray-200">
                  <span>Total:</span>
                  <span>${(Number(cart.totalPrice) || 0).toFixed(2)}</span>
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>Your cart is empty</p>
              <Link
                href="/list"
                className="text-lama hover:underline text-sm mt-2 inline-block"
              >
                Continue Shopping
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
