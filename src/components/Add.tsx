"use client";

import { useCartStore } from "@/hooks/useCartStore";
import { VisitorCartProduct } from "@/lib/visitorCart";
import SuccessToast from "@/components/Toast/SuccessToast";
import ErrorToast from "@/components/Toast/ErrorToast";
import { getCookie } from "cookies-next";
import { useState } from "react";

const Add = ({
  productId,
  variantId,
  stockNumber,
  productName,
  productData,
}: {
  productId: string;
  variantId: string;
  stockNumber: number;
  productName?: string;
  productData?: {
    price?: { price?: number; discountedPrice?: number };
    imageUrl?: string;
  };
}) => {
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const { addItem, addVisitorItem } = useCartStore();

  const handleQuantity = (type: "i" | "d") => {
    if (type === "d" && quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
    if (type === "i" && quantity < stockNumber) {
      setQuantity((prev) => prev + 1);
    }
  };

  const handleAddToCart = async () => {
    setLoading(true);
    setMessage(null);

    try {
      const token = getCookie("token");

      if (!token) {
        const guestProduct: VisitorCartProduct = {
          _id: productId,
          name: productName || "Product",
          price: productData?.price,
          media: productData?.imageUrl
            ? { mainMedia: { image: { url: productData.imageUrl } } }
            : undefined,
        };

        addVisitorItem(guestProduct, quantity);
      } else {
        try {
          await addItem(productId, quantity);
        } catch (err: any) {
          // Token was stale (401) — the interceptor cleared it; fall back to visitor cart
          if (err?.response?.status === 401) {
            const guestProduct: VisitorCartProduct = {
              _id: productId,
              name: productName || "Product",
              price: productData?.price,
              media: productData?.imageUrl
                ? { mainMedia: { image: { url: productData.imageUrl } } }
                : undefined,
            };
            addVisitorItem(guestProduct, quantity);
          } else {
            throw err;
          }
        }
      }

      setMessage({
        type: "success",
        text: "Product added to cart successfully!",
      });

      setQuantity(1);

      // Clear message after 3 seconds
      setTimeout(() => {
        setMessage(null);
      }, 3000);
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to add item to cart";

      setMessage({
        type: "error",
        text: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {message && (
        <div>
          {message.type === "success" ? (
            <SuccessToast successMsg={message.text} />
          ) : (
            <ErrorToast errorMsg={message.text} />
          )}
        </div>
      )}
      <h4 className="font-medium">Choose a Quantity</h4>
      <div className="flex justify-between">
        <div className="flex items-center gap-4">
          <div className="bg-gray-100 py-2 px-4 rounded-3xl flex items-center justify-between w-32">
            <button
              className="cursor-pointer text-xl disabled:cursor-not-allowed disabled:opacity-20"
              onClick={() => handleQuantity("d")}
              disabled={quantity === 1}
              suppressHydrationWarning
            >
              -
            </button>
            {quantity}
            <button
              className="cursor-pointer text-xl disabled:cursor-not-allowed disabled:opacity-20"
              onClick={() => handleQuantity("i")}
              disabled={quantity === stockNumber}
              suppressHydrationWarning
            >
              +
            </button>
          </div>
          {stockNumber < 1 ? (
            <div className="text-xs">Product is out of stock</div>
          ) : (
            <div className="text-xs">
              Only <span className="text-orange-500">{stockNumber} items</span>{" "}
              left!
              <br /> {"Don't"} miss it
            </div>
          )}
        </div>
        <button
          onClick={handleAddToCart}
          disabled={loading || stockNumber < 1}
          className="w-36 text-sm rounded-3xl ring-1 ring-lama text-lama py-2 px-4 hover:bg-lama hover:text-white disabled:cursor-not-allowed disabled:bg-pink-200 disabled:ring-0 disabled:text-white disabled:ring-none transition-all duration-200"
          suppressHydrationWarning
        >
          {loading ? "Adding..." : "Add to Cart"}
        </button>
      </div>
    </div>
  );
};

export default Add;
