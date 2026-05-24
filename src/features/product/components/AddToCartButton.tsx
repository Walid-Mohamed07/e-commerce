"use client";

import { useState } from "react";
import { getCookie } from "cookies-next";
import { VisitorCartProduct } from "@/lib/visitorCart";
import { useCartStore } from "@/hooks/useCartStore";
import SuccessToast from "@/components/Toast/SuccessToast";
import ErrorToast from "@/components/Toast/ErrorToast";

interface AddToCartButtonProps {
  productId: string;
  productName: string;
  variantId?: string;
  /** Full product details stored in the visitor cart so CartModal can render them */
  productData?: {
    price?: { price?: number; discountedPrice?: number };
    imageUrl?: string;
  };
}

export default function AddToCartButton({
  productId,
  productName,
  variantId,
  productData,
}: AddToCartButtonProps) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [quantity] = useState(1);

  const { addItem, addVisitorItem } = useCartStore();

  const handleAddToCart = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    setLoading(true);
    setMessage(null);

    try {
      const token = getCookie("token");

      if (!token) {
        // Guest user — save to global visitor cart store
        const visitorProduct: VisitorCartProduct = {
          _id: productId,
          name: productName,
          price: productData?.price,
          media: productData?.imageUrl
            ? { mainMedia: { image: { url: productData.imageUrl } } }
            : undefined,
        };
        addVisitorItem(visitorProduct, quantity);
      } else {
        // Authenticated user — call server API and update store
        await addItem(productId, quantity);
      }

      setMessage({ type: "success", text: `${productName} added to cart!` });

      setTimeout(() => setMessage(null), 3000);
    } catch (error: any) {
      setMessage({
        type: "error",
        text:
          error?.response?.data?.message ||
          error?.message ||
          "Failed to add item to cart",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative">
      {message && (
        <div className="absolute bottom-12 left-0 right-0 z-50">
          {message.type === "success" ? (
            <SuccessToast successMsg={message.text} />
          ) : (
            <ErrorToast errorMsg={message.text} />
          )}
        </div>
      )}
      <button
        onClick={handleAddToCart}
        disabled={loading}
        className="w-full rounded-2xl ring-1 ring-lama text-lama py-2 px-4 text-xs opacity-100 hover:bg-lama hover:text-white hover:opacity-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
        suppressHydrationWarning
      >
        {loading ? "Adding..." : "Add to Cart"}
      </button>
    </div>
  );
}
