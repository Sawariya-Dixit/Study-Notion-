import React, { useEffect, useState } from "react"
import { Swiper, SwiperSlide } from "swiper/react"
import "swiper/css"
import "swiper/css/free-mode"
import "swiper/css/pagination"
import { Autoplay, FreeMode, Pagination } from "swiper/modules"
import StarRating from "../common/StarRating"

import { apiConnector } from "../../../../services/apiConnector"
import { ratingsEndpoints } from "../../../../services/operations/apis"

function ReviewSlider() {
  const [reviews, setReviews] = useState([])
  const truncateWords = 15

  useEffect(() => {
    (async () => {
      const { data } = await apiConnector(
        "GET",
        ratingsEndpoints.REVIEWS_DETAILS_API
      )
      if (data?.success) {
        setReviews(data?.data)
      }
    })()
  }, [])

  return (
    <div className="text-[var(--white)] py-10">
      <div className="max-w-maxContent lg:max-w-[1200px] mx-auto">
       <Swiper
  loop={true}
  freeMode={true}
  autoplay={{
    delay: 2500,
    disableOnInteraction: false,
  }}
  modules={[FreeMode, Pagination, Autoplay]}
  className="w-full"
  breakpoints={{
    320: {
      slidesPerView: 1,
      spaceBetween: 16,
    },
    480: {
      slidesPerView: 1.2,
      spaceBetween: 16,
    },
    640: {
      slidesPerView: 2,
      spaceBetween: 20,
    },
    768: {
      slidesPerView: 2.2,
      spaceBetween: 24,
    },
    1024: {
      slidesPerView: 3,
      spaceBetween: 25,
    },
    1280: {
      slidesPerView: 3.5,
      spaceBetween: 30,
    },
  }}
>

          {reviews.map((review, i) => (
            <SwiperSlide key={i}>
           <div className="flex flex-col gap-3 bg-[var(--richblack-800)] p-4 sm:p-5 rounded-xl shadow-lg">
                
                {/* User Info */}
                <div className="flex items-center gap-4">
                  <img
                    src={
                      review?.user?.image
                        ? review?.user?.image
                        : `https://api.dicebear.com/5.x/initials/svg?seed=${reviews?.user?.firstName} ${reviews?.user?.lastName}`
                    }
                    alt="User"
                    className="h-12 w-12 rounded-full object-cover border-2 border-[var(--yellow-100)]"
                  />
                  <div className="flex flex-col">
                <h1 className="font-semibold text-sm sm:text-base text-[var(--richblack-5)]">
                      {`${review?.user?.firstName} ${review?.user?.lastName}`}
                    </h1>
                    <h2 className="text-[12px] font-medium text-[var(--richblack-500)]">
                      {review?.course?.courseName}
                    </h2>
                  </div>
                </div>

                {/* Review Text */}
                <p className="font-medium text-xs sm:text-sm text-[var(--richblack-25)] mt-2">
                  {review?.review.split(" ").length > truncateWords
                    ? `${review?.review
                        .split(" ")
                        .slice(0, truncateWords)
                        .join(" ")} ...`
                    : review?.review}
                </p>

                {/* Rating */}
                <div className="flex items-center gap-2 mt-2">
                  <h3 className="font-semibold text-[var(--yellow-100)]">
                    {review.rating.toFixed(1)}
                  </h3>
                  <StarRating rating={review.rating} readOnly={true} size={20} />
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  )
}

export default ReviewSlider
