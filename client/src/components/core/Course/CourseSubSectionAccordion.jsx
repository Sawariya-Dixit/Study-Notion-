import React from "react";
import { HiOutlineVideoCamera } from "react-icons/hi";

function CourseSubSectionAccordion({ subSec }) {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between py-2 px-3 md:px-5 
        rounded transition-colors 
        hover:bg-[var(--richblack-700)]">

        <div className="flex items-center gap-2">
          {/* Icon with custom variable color */}
          <HiOutlineVideoCamera className="text-[var(--yellow-25)]" />

          {/* Title text */}
          <p className="text-sm md:text-base font-medium text-[var(--richblack-5)]">
            {subSec?.title}
          </p>
        </div>

        {/* Duration text */}
        <span className="text-xs md:text-sm text-[var(--richblack-300)]">
          {subSec?.duration || ""}
        </span>
      </div>
    </div>
  );
}

export default CourseSubSectionAccordion;
