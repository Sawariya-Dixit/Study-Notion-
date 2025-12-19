import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, FreeMode, Pagination, Navigation } from "swiper/modules";

import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/pagination";
import "swiper/css/navigation";

import Course_Card from "./Course_Card";

const CourseSlider = ({ Courses = [] }) => {
  return (
    <>
      {Courses.length > 0 ? (
        <Swiper
          modules={[FreeMode, Pagination, Autoplay, Navigation]}
          freeMode
          loop
          autoplay={{
            delay: 2500,
            disableOnInteraction: false,
          }}
          pagination={{ clickable: true }}
          navigation={true}
          spaceBetween={16}
          breakpoints={{
            0: {
              slidesPerView: 1,
              navigation: false,
            },
            480: {
              slidesPerView: 1.2,
              navigation: false,
            },
            640: {
              slidesPerView: 1.5,
              navigation: false,
            },
            768: {
              slidesPerView: 2,
              navigation: true,
            },
            1024: {
              slidesPerView: 3,
            },
            1280: {
              slidesPerView: 3.5,
            },
          }}
          className="!pb-10"
        >
          {Courses.map((course, index) => (
            <SwiperSlide key={index} className="h-auto">
              <Course_Card
                course={course}
                Height="h-40 sm:h-44 md:h-48"
              />
            </SwiperSlide>
          ))}
        </Swiper>
      ) : (
        <p className="text-lg sm:text-xl text-[var(--richblack-5)]">
          No Course Found
        </p>
      )}
    </>
  );
};

export default CourseSlider;
