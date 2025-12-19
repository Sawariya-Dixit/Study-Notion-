import React from "react";
import { HiOutlineVideoCamera } from "react-icons/hi";

function CourseSubSectionAccordion({ subSec }) {
  return (
    <div className="w-full">
      <div
        className="
          flex items-start sm:items-center justify-between
          gap-3
          rounded-md
          px-3 py-2
          sm:px-4 sm:py-2.5
          transition-colors
          hover:bg-[var(--richblack-700)]
        "
      >
        {/* LEFT: ICON + TITLE */}
        <div className="flex min-w-0 items-start sm:items-center gap-2">
          <HiOutlineVideoCamera
            className="flex-shrink-0 text-[var(--yellow-25)]"
            size={18}
          />

          <p
            className="
              text-xs sm:text-sm md:text-base
              font-medium
              text-[var(--richblack-5)]
              line-clamp-2
            "
          >
            {subSec?.title}
          </p>
        </div>

        {/* RIGHT: DURATION */}
        <span
          className="
            flex-shrink-0
            text-xs sm:text-sm
            text-[var(--richblack-300)]
            whitespace-nowrap
          "
        >
          {subSec?.duration || ""}
        </span>
      </div>
    </div>
  );
}

export default CourseSubSectionAccordion;
