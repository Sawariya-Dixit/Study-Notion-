import React, { useEffect, useState } from 'react';
import RatingStars from "../HomePage/common/RatingStars";
import GetAvgRating from '../../../utils/avgRating';
import { Link } from 'react-router-dom';

const Course_Card = ({ course, Height }) => {
  const [avgReviewCount, setAvgReviewCount] = useState(0);

  useEffect(() => {
    const count = GetAvgRating(course.ratingAndReviews);
    setAvgReviewCount(count);
  }, [course]);

  return (
    <Link to={`/course/${course._id}`}>
      <div className="">
        <div className="rounded-lg">
          <img
            src={course?.thumbnail}
            alt="course thumbnail"
            className={`${Height} w-full rounded-xl object-cover`}
          />
        </div>

        <div className="flex flex-col gap-2 px-1 py-3">
          {/* Course Name */}
          <p className="text-xl text-[var(--richblack-5)]">
            {course?.courseName}
          </p>

          {/* Instructor Name */}
          <p className="text-sm text-[var(--richblack-50)]">
            {course?.instructor?.firstName} {course?.instructor?.lastName}
          </p>

          {/* Ratings */}
          <div className="flex items-center gap-2">
            <span className="text-[var(--yellow-5)]">{avgReviewCount || 0}</span>
            <RatingStars Review_Count={avgReviewCount} />
            <span className="text-[var(--richblack-400)]">
              {course?.ratingAndReviews?.length} Ratings
            </span>
          </div>

          {/* Price */}
          <p className="text-xl text-[var(--richblack-5)]">
            Rs. {course?.price}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default Course_Card;
