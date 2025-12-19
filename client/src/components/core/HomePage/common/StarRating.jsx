import { FaStar } from "react-icons/fa";

export default function StarRating({
  rating = 0,
  setRating,
  size = 16,
  readOnly = false,
}) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <FaStar
          key={star}
          size={size}
          onClick={() => !readOnly && setRating && setRating(star)}
          className={`transition-colors ${
            star <= rating ? "text-yellow-400" : "text-gray-400"
          } ${readOnly ? "cursor-default" : "cursor-pointer"}`}
        />
      ))}
    </div>
  );
}
