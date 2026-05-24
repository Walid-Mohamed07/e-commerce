"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { format } from "timeago.js";
import { reviewsService, Review } from "@/service/reviews";
import { getMediaUrl } from "@/lib/mediaUrl";

// ─── Helpers ───────────────────────────────────────────────────────────────────

const Stars = ({ rating }: { rating: number }) => (
  <div className="flex gap-0.5" aria-label={`${rating} out of 5 stars`}>
    {[1, 2, 3, 4, 5].map((s) => (
      <svg
        key={s}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        className="w-3.5 h-3.5"
        fill={s <= rating ? "#FBBF24" : "none"}
        stroke={s <= rating ? "#FBBF24" : "#D1D5DB"}
        strokeWidth={1.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z"
        />
      </svg>
    ))}
  </div>
);

const InitialsAvatar = ({ name }: { name: string }) => {
  const initials = name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
  return (
    <div className="w-9 h-9 rounded-full bg-lama flex items-center justify-center text-white text-sm font-semibold flex-shrink-0 select-none">
      {initials || "?"}
    </div>
  );
};

// ─── Skeleton ──────────────────────────────────────────────────────────────────

const ReviewSkeleton = () => (
  <div className="flex flex-col gap-4 animate-pulse">
    {[1, 2, 3].map((i) => (
      <div key={i} className="flex gap-3">
        <div className="w-9 h-9 rounded-full bg-gray-200 flex-shrink-0" />
        <div className="flex-1 bg-gray-100 rounded-2xl px-4 py-3 space-y-2">
          <div className="flex gap-3 items-center">
            <div className="h-3 w-24 bg-gray-200 rounded" />
            <div className="h-3 w-16 bg-gray-200 rounded" />
          </div>
          <div className="h-3 w-3/4 bg-gray-200 rounded" />
          <div className="h-3 w-1/2 bg-gray-200 rounded" />
        </div>
      </div>
    ))}
  </div>
);

// ─── Component ─────────────────────────────────────────────────────────────────

const Reviews = ({ productId }: { productId: string }) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    reviewsService
      .getProductReviews(productId)
      .then(setReviews)
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [productId]);

  if (loading) return <ReviewSkeleton />;

  if (error)
    return (
      <p className="text-sm text-red-400">Could not load reviews.</p>
    );

  if (reviews.length === 0)
    return (
      <p className="text-sm text-gray-400">
        No reviews yet. Be the first to review this product!
      </p>
    );

  return (
    <div className="flex flex-col gap-4">
      {reviews.map((review) => {
        const user =
          typeof review.user === "string"
            ? { username: "Anonymous", _id: review.user, email: "" }
            : review.user;

        return (
          <div key={review._id} className="flex gap-3">
            {/* Avatar */}
            <InitialsAvatar name={user.username} />

            {/* Bubble */}
            <div className="flex-1 bg-gray-50 rounded-2xl rounded-tl-sm px-4 py-3">
              {/* Header row */}
              <div className="flex items-center flex-wrap gap-x-2 gap-y-0.5">
                <span className="text-sm font-semibold text-gray-900">
                  {user.username}
                </span>
                <Stars rating={review.rating} />
                <span className="text-xs text-gray-400">
                  {format(review.createdAt)}
                </span>
              </div>

              {/* Summary */}
              {review.summary && (
                <p className="text-sm font-medium text-gray-800 mt-1">
                  {review.summary}
                </p>
              )}

              {/* Details */}
              {review.details && (
                <p className="text-sm text-gray-500 mt-0.5 leading-relaxed">
                  {review.details}
                </p>
              )}

              {/* Media */}
              {review.media && review.media.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {review.media.map((m, i) => {
                    const src = getMediaUrl(m?.url);
                    if (!src || src === "/unknown.webp") return null;
                    return m.type === "video" ? (
                      <video
                        key={i}
                        src={src}
                        controls
                        className="w-24 h-24 rounded-lg object-cover bg-gray-200"
                      />
                    ) : (
                      <div
                        key={i}
                        className="relative w-24 h-24 rounded-lg overflow-hidden bg-gray-200"
                      >
                        <Image
                          src={src}
                          alt={`Review media ${i + 1}`}
                          fill
                          className="object-cover"
                        />
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Reviews;
