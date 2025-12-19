import React, { useEffect, useState } from "react";
import RatingStars from "../HomePage/common/RatingStars";
import GetAvgRating from "../../../utils/avgRating";
import { Link } from "react-router-dom";

const Course_Card = ({ course, Height }) => {
  const [avgReviewCount, setAvgReviewCount] = useState(0);

  useEffect(() => {
    const count = GetAvgRating(course?.ratingAndReviews);
    setAvgReviewCount(count);
  }, [course]);

  return (
    <Link to={`/course/${course?._id}`} className="group">
      <div className="w-full">
        
        {/* Thumbnail */}
        <div className="rounded-xl overflow-hidden">
          <img
            src={course?.thumbnail}
            alt="course thumbnail"
            className={`
              w-full object-cover rounded-xl
              ${Height ? Height : "h-40 sm:h-44 md:h-48"}
              group-hover:scale-105 transition-transform duration-300
            `}
          />
        </div>

        {/* Content */}
        <div className="flex flex-col gap-1 sm:gap-2 px-1 py-3">
          
          {/* Course Name */}
          <p className="text-base sm:text-lg md:text-xl 
            text-[var(--richblack-5)] 
            font-semibold line-clamp-2">
            {course?.courseName}
          </p>

          {/* Instructor */}
          <p className="text-xs sm:text-sm text-[var(--richblack-50)]">
            {course?.instructor?.firstName} {course?.instructor?.lastName}
          </p>

          {/* Ratings */}
          <div className="flex flex-wrap items-center gap-1 sm:gap-2">
            <span className="text-sm text-[var(--yellow-5)]">
              {avgReviewCount || 0}
            </span>

            <RatingStars Review_Count={avgReviewCount} />

            <span className="text-xs sm:text-sm text-[var(--richblack-400)]">
              {course?.ratingAndReviews?.length} Ratings
            </span>
          </div>

          {/* Price */}
          <p className="text-base sm:text-lg text-[var(--richblack-5)] font-semibold">
            ₹ {course?.price}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default Course_Card;
