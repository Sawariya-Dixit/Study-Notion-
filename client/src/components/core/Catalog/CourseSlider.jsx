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
          freeMode={true}
          loop={true}
          autoplay={{
            delay: 2200,
            disableOnInteraction: false,
          }}
          pagination={{ clickable: true }}
          navigation={true}
          spaceBetween={25}
          breakpoints={{
            320: { slidesPerView: 1 },
            640: { slidesPerView: 1.5 },
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
            1280: { slidesPerView: 3.5 },
          }}
          className="!pb-8"
        >
          {Courses.map((course, index) => (
            <SwiperSlide key={index}>
              <Course_Card course={course} Height="h-[250px]" />
            </SwiperSlide>
          ))}
        </Swiper>
      ) : (
        <p className="text-xl text-[var(--richblack-5)]">No Course Found</p>
      )}
    </>
  );
};

export default CourseSlider;
