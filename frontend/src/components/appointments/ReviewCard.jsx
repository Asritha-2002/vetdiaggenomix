import React from "react";
import { Star, MessageSquare } from "lucide-react";
import { format } from "date-fns";

function StarRating({ rating = 0 }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`w-4 h-4 ${
            star <= rating ? "text-amber-400 fill-amber-400" : "text-gray-300"
          }`}
        />
      ))}
    </div>
  );
}

export default function ReviewCard({ reviews = [] }) {
  if (reviews.length === 0) {
    return (
      <div className="bg-gray-50 rounded-xl border border-gray-200 p-6 text-center">
        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
          <MessageSquare className="w-5 h-5 text-gray-400" />
        </div>
        <p className="text-sm text-gray-500">
          No reviews from this customer yet
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {reviews.map((review) => (
        <div
          key={review._id}
          className="bg-[#f9fafb] rounded-xl border border-gray-200 p-5 shadow-sm"
        >
          {/* Rating + Date */}
          <div className="flex items-center justify-between mb-3">
            <StarRating rating={review.rating || 0} />
            <span className="text-xs text-gray-500">
              {review.createdAt
                ? format(new Date(review.createdAt), "MMM dd, yyyy")
                : "N/A"}
            </span>
          </div>

          {/* Review Text */}
          <p className="text-sm text-gray-700 leading-relaxed">
            "{review.review}"
          </p>

          {/* Footer */}
          <div className="mt-3 pt-3 border-t border-gray-200">
            <p className="text-xs text-gray-500">
              Appointment ID:{" "}
              <span className="font-mono text-gray-700">
                {review.appointmentId}
              </span>
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}