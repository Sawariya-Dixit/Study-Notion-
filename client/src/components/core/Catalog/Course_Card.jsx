import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import StarRating from "../HomePage/common/StarRating";
import GetAvgRating from "../../../utils/avgRating";

const Course_Card = ({ course, Height }) => {
  const [avgRating, setAvgRating] = useState(0);

  useEffect(() => {
    const rating = GetAvgRating(course?.ratingAndReviews);
    setAvgRating(rating);
  }, [course]);

  return (
    <Link to={`/course/${course?._id}`} className="group w-full">
      <div className="w-full">

        {/* ================= THUMBNAIL ================= */}
        <div className="overflow-hidden rounded-xl">
          <img
            src={course?.thumbnail}
            alt="course thumbnail"
            className={`w-full object-cover rounded-xl
              ${Height || "h-40 sm:h-44 md:h-48 lg:h-52"}
              group-hover:scale-105 transition-transform duration-300`}
          />
        </div>

        {/* ================= CONTENT ================= */}
        <div className="flex flex-col gap-1.5 sm:gap-2 px-1 py-3">

          {/* Course Name */}
          <p className="text-sm sm:text-base md:text-lg font-semibold 
            text-[var(--richblack-5)] line-clamp-2">
            {course?.courseName}
          </p>

          {/* Instructor */}
          <p className="text-xs sm:text-sm text-[var(--richblack-50)]">
            {course?.instructor?.firstName} {course?.instructor?.lastName}
          </p>

          {/* ================= RATING ================= */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm text-[var(--yellow-5)] font-medium">
              {avgRating.toFixed(1)}
            </span>

            <StarRating
              rating={avgRating}
              readOnly={true}
              size={16}
            />

            <span className="text-xs sm:text-sm text-[var(--richblack-400)]">
              ({course?.ratingAndReviews?.length || 0})
            </span>
          </div>

          {/* Price */}
          <p className="text-sm sm:text-base md:text-lg 
            text-[var(--richblack-5)] font-semibold">
            ₹ {course?.price}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default Course_Card;
