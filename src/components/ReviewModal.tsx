"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { reviewsService } from "@/service/reviews";

// ─── Types ─────────────────────────────────────────────────────────────────────

interface ProductInfo {
  id: string;
  name: string;
  imageUrl?: string;
}

interface ReviewModalProps {
  product: ProductInfo;
  orderId: string;
  onClose: () => void;
  onSuccess?: () => void;
}

// ─── Star Rating ───────────────────────────────────────────────────────────────

const StarRating = ({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) => {
  const [hovered, setHovered] = useState(0);

  return (
    <div className="flex gap-1" role="radiogroup" aria-label="Rating">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          aria-label={`${star} star${star > 1 ? "s" : ""}`}
          onMouseEnter={() => setHovered(star)}
          onMouseLeave={() => setHovered(0)}
          onClick={() => onChange(star)}
          className="focus:outline-none"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            className="w-8 h-8 transition-colors"
            fill={(hovered || value) >= star ? "#FBBF24" : "none"}
            stroke={(hovered || value) >= star ? "#FBBF24" : "#D1D5DB"}
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z"
            />
          </svg>
        </button>
      ))}
    </div>
  );
};

// ─── Modal ─────────────────────────────────────────────────────────────────────

const ReviewModal = ({ product, orderId, onClose, onSuccess }: ReviewModalProps) => {
  const [rating, setRating] = useState(0);
  const [summary, setSummary] = useState("");
  const [details, setDetails] = useState("");
  const [mediaFiles, setMediaFiles] = useState<File[]>([]);
  const [mediaPreviews, setMediaPreviews] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Prevent body scroll while modal is open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  // Revoke object URLs on unmount to free memory
  useEffect(() => {
    return () => {
      mediaPreviews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [mediaPreviews]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;

    const newPreviews = files.map((f) => URL.createObjectURL(f));
    setMediaFiles((prev) => [...prev, ...files]);
    setMediaPreviews((prev) => [...prev, ...newPreviews]);

    // Reset input so the same file can be re-selected
    e.target.value = "";
  };

  const removeMedia = (index: number) => {
    URL.revokeObjectURL(mediaPreviews[index]);
    setMediaFiles((prev) => prev.filter((_, i) => i !== index));
    setMediaPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (rating === 0) {
      setError("Please select a star rating.");
      return;
    }
    if (!summary.trim()) {
      setError("Please provide a summary.");
      return;
    }

    setSubmitting(true);
    try {
      await reviewsService.createReview({
        productId: product.id,
        orderId,
        rating,
        summary: summary.trim(),
        details: details.trim() || undefined,
        media: mediaFiles.length ? mediaFiles : undefined,
      });
      onSuccess?.();
      onClose();
    } catch {
      setError("Failed to submit review. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* Panel */}
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">
            Review Product
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="text-gray-400 hover:text-gray-600 transition rounded-full p-1 -mr-1"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18 18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 flex flex-col gap-5">
          {/* Product */}
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
              Product
            </p>
            <div className="flex items-center gap-3 bg-gray-50 rounded-xl p-3">
              {product.imageUrl ? (
                <div className="relative w-14 h-14 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
                  <Image
                    src={product.imageUrl}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="w-14 h-14 flex-shrink-0 rounded-lg bg-gray-200 flex items-center justify-center text-2xl">
                  📦
                </div>
              )}
              <span className="text-sm font-medium text-gray-800 line-clamp-2">
                {product.name}
              </span>
            </div>
          </div>

          {/* Rating */}
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
              Rating <span className="text-red-400">*</span>
            </p>
            <StarRating value={rating} onChange={setRating} />
          </div>

          {/* Summary */}
          <div>
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide block mb-1">
              Summary <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              maxLength={120}
              placeholder="e.g. Great quality, fast shipping"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-lama/50 focus:border-lama transition"
            />
          </div>

          {/* Details */}
          <div>
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide block mb-1">
              Details
            </label>
            <textarea
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              rows={4}
              maxLength={1000}
              placeholder="Tell us more about your experience with this product…"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-lama/50 focus:border-lama transition resize-none"
            />
          </div>

          {/* Photos & Videos */}
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
              Photos &amp; Videos
            </p>

            {/* Previews */}
            {mediaPreviews.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3">
                {mediaPreviews.map((src, i) => (
                  <div
                    key={i}
                    className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-100 group"
                  >
                    {mediaFiles[i]?.type.startsWith("video/") ? (
                      <video
                        src={src}
                        className="w-full h-full object-cover"
                        muted
                      />
                    ) : (
                      <Image
                        src={src}
                        alt={`media-${i}`}
                        fill
                        className="object-cover"
                      />
                    )}
                    <button
                      type="button"
                      onClick={() => removeMedia(i)}
                      aria-label="Remove"
                      className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white text-lg font-bold"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2 border border-dashed border-gray-300 rounded-xl px-4 py-3 text-sm text-gray-500 hover:border-lama hover:text-lama transition w-full justify-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.5}
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 16.5V9.75m0 0 3 3m-3-3-3 3M6.75 19.5a4.5 4.5 0 0 1-1.41-8.775 5.25 5.25 0 0 1 10.338-2.32 5.25 5.25 0 0 1 1.841 10.122H6.75z"
                />
              </svg>
              Upload photos or videos
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,video/*"
              multiple
              className="hidden"
              onChange={handleFileChange}
            />
          </div>

          {/* Error */}
          {error && (
            <p className="text-sm text-red-500 -mt-2">{error}</p>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-lama text-white py-3 rounded-xl font-semibold text-sm hover:opacity-90 transition disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {submitting ? "Submitting…" : "Submit Review"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ReviewModal;
