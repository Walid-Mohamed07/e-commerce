"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import SuccessToast from "@/components/Toast/SuccessToast";
import ErrorToast from "@/components/Toast/ErrorToast";
import Link from "next/link";
import useCart from "@/hooks/useCart";
import { useCartStore } from "@/hooks/useCartStore";
import Image from "next/image";
import { ordersService, CreateOrderPayload } from "@/service/Orders";
import { cartService } from "@/features/product/services/cart";

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, loading: cartLoading, fetchCart } = useCart();
  const { clearCart } = useCartStore();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    addressLine: "",
    city: "",
    country: "",
    postalCode: "",
    shippingNotes: "",
  });

  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formData.firstName.trim() || !formData.lastName.trim()) {
      setMessage({ type: "error", text: "First and last name are required" });
      return;
    }
    if (!formData.email.trim()) {
      setMessage({ type: "error", text: "Email is required" });
      return;
    }
    if (
      !formData.addressLine.trim() ||
      !formData.city.trim() ||
      !formData.country.trim() ||
      !formData.postalCode.trim()
    ) {
      setMessage({ type: "error", text: "Complete address is required" });
      return;
    }
    if (!cart?.items?.length) {
      setMessage({ type: "error", text: "Your cart is empty" });
      return;
    }

    setCheckoutLoading(true);
    setMessage(null);

    try {
      // Build line items from cart
      const lineItems = cart.items.map((item) => {
        const product = typeof item.product === "string" ? null : item.product;
        return {
          productId:
            product?._id ??
            (typeof item.product === "string" ? item.product : ""),
          name: product?.name ?? "Product",
          quantity: item.quantity,
          price: Number(item.price) || 0,
          mediaItem: product?.media?.mainMedia?.image?.url
            ? { src: product.media.mainMedia.image.url, type: "IMAGE" }
            : undefined,
        };
      });

      const subtotal = lineItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0,
      );
      const shipping = Number(cart.shipping) || 0;
      const tax = Number(cart.tax) || 0;
      const total = subtotal + shipping + tax;

      const payload: CreateOrderPayload = {
        billingInfo: {
          address: {
            addressLine: formData.addressLine,
            city: formData.city,
            country: formData.country,
            postalCode: formData.postalCode,
          },
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone || undefined,
        },
        lineItems,
        totals: { subtotal, total, shipping, tax },
        shippingInfo: formData.shippingNotes
          ? {
              deliveryOption: "Standard",
              shipmentDetails: {
                address: {
                  addressLine: formData.addressLine,
                  city: formData.city,
                  country: formData.country,
                  postalCode: formData.postalCode,
                },
                firstName: formData.firstName,
                lastName: formData.lastName,
                email: formData.email,
                phone: formData.phone || undefined,
              },
            }
          : undefined,
      };

      const order = await ordersService.createOrder(payload);

      // Clear the cart after successful order
      await cartService.clearCart();
      clearCart();

      setMessage({ type: "success", text: "Order placed successfully!" });

      setTimeout(() => {
        router.push(`/success?orderId=${order._id}`);
      }, 2000);
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to place order";
      setMessage({ type: "error", text: errorMessage });
    } finally {
      setCheckoutLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 pt-24 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Form - Left Side */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-md p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
            <p className="text-gray-600 mt-2">
              Complete your purchase by providing billing & shipping details
            </p>
          </div>

          {message && (
            <div className="mb-6">
              {message.type === "success" ? (
                <SuccessToast successMsg={message.text} />
              ) : (
                <ErrorToast errorMsg={message.text} />
              )}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="firstName"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  First Name
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  placeholder="John"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  disabled={checkoutLoading}
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="lastName"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Last Name
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  placeholder="Doe"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  disabled={checkoutLoading}
                  required
                />
              </div>
            </div>

            {/* Email & Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="john@example.com"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  disabled={checkoutLoading}
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Phone <span className="text-gray-400">(optional)</span>
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="+1-234-567-8900"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  disabled={checkoutLoading}
                />
              </div>
            </div>

            {/* Address Line */}
            <div>
              <label
                htmlFor="addressLine"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Address
              </label>
              <input
                type="text"
                id="addressLine"
                name="addressLine"
                value={formData.addressLine}
                onChange={handleInputChange}
                placeholder="235 W 23rd St"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                disabled={checkoutLoading}
                required
              />
            </div>

            {/* City, Country, Postal Code */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label
                  htmlFor="city"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  City
                </label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  placeholder="New York"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  disabled={checkoutLoading}
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="country"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Country
                </label>
                <input
                  type="text"
                  id="country"
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                  placeholder="US"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  disabled={checkoutLoading}
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="postalCode"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Postal Code
                </label>
                <input
                  type="text"
                  id="postalCode"
                  name="postalCode"
                  value={formData.postalCode}
                  onChange={handleInputChange}
                  placeholder="10011"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  disabled={checkoutLoading}
                  required
                />
              </div>
            </div>

            {/* Shipping Notes */}
            <div>
              <label
                htmlFor="shippingNotes"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Shipping Notes <span className="text-gray-400">(optional)</span>
              </label>
              <textarea
                id="shippingNotes"
                name="shippingNotes"
                value={formData.shippingNotes}
                onChange={handleInputChange}
                placeholder="e.g., Leave at door, ring doorbell, etc."
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition resize-none"
                disabled={checkoutLoading}
              />
            </div>

            {/* Actions */}
            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={checkoutLoading || !cart?.items?.length}
                className="flex-1 bg-lama hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
              >
                {checkoutLoading ? "Processing..." : "Place Order"}
              </button>
              <Link
                href="/list"
                className="flex-1 text-center bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded-lg transition duration-200"
              >
                Continue Shopping
              </Link>
            </div>
          </form>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-gray-600 text-sm text-center">
              ✓ Your information is secure and encrypted
            </p>
          </div>
        </div>

        {/* Order Summary - Right Side */}
        <div className="bg-white rounded-lg shadow-md p-6 h-fit">
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            Order Summary
          </h2>

          {cartLoading ? (
            <div className="space-y-4 animate-pulse">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="flex gap-3 pb-4 border-b border-gray-200"
                >
                  <div className="w-20 h-20 bg-gray-200 rounded flex-shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4" />
                    <div className="h-3 bg-gray-200 rounded w-1/2" />
                    <div className="h-4 bg-gray-200 rounded w-2/3" />
                  </div>
                </div>
              ))}
              <div className="space-y-2 pt-4 border-t border-gray-200">
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
                {cart.items.map((item, index) => {
                  const product =
                    typeof item.product === "string" ? null : item.product;
                  const productId =
                    product?._id ??
                    (typeof item.product === "string"
                      ? item.product
                      : `item-${index}`);
                  const productName = product?.name ?? "Product";
                  const productImage =
                    product?.media?.mainMedia?.image?.url ??
                    product?.media?.items?.[0]?.image?.url ??
                    null;
                  const subtotal =
                    (Number(item.price) || 0) * (item.quantity || 1);
                  return (
                    <div
                      key={productId || index}
                      className="flex gap-3 pb-4 border-b border-gray-200"
                    >
                      {productImage && (
                        <div className="relative w-20 h-20 flex-shrink-0">
                          <Image
                            src={productImage}
                            alt={productName}
                            fill
                            className="object-cover rounded"
                          />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-sm text-gray-900 truncate">
                          {productName}
                        </h3>
                        <p className="text-xs text-gray-500 mt-1">
                          Qty: {item.quantity}
                        </p>
                        <p className="text-sm font-semibold text-gray-900 mt-2">
                          ${(Number(item.price) || 0).toFixed(2)} each
                        </p>
                        <p className="text-xs text-lama font-medium">
                          Subtotal: ${subtotal.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
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
