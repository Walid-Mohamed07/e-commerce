"use client";

import { useState } from "react";
import { cartService } from "../services/cart";
import SuccessToast from "@/components/Toast/SuccessToast";
import ErrorToast from "@/components/Toast/ErrorToast";

interface AddToCartButtonProps {
  productId: string;
  productName: string;
  variantId?: string;
}

export default function AddToCartButton({
  productId,
  productName,
  variantId,
}: AddToCartButtonProps) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [quantity] = useState(1);

  const handleAddToCart = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    setLoading(true);
    setMessage(null);

    try {
      await cartService.addToCart({
        productId,
        quantity,
      });

      setMessage({
        type: "success",
        text: `${productName} added to cart!`,
      });

      // Emit custom event to trigger cart modal update
      window.dispatchEvent(new Event("cartUpdated"));

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
      >
        {loading ? "Adding..." : "Add to Cart"}
      </button>
    </div>
  );
}
