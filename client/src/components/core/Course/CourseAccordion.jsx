import { useEffect, useRef, useState } from "react";
import { AiOutlineDown } from "react-icons/ai";
import CourseSubSectionAccordion from "./CourseSubSectionAccordion";

export default function CourseAccordionBar({ course, isActive, handleActive }) {
  const contentEl = useRef(null);
  const [active, setActive] = useState(false);
  const [sectionHeight, setSectionHeight] = useState(0);

  // sync active state
  useEffect(() => {
    setActive(isActive?.includes(course._id));
  }, [isActive, course._id]);

  // height animation
  useEffect(() => {
    setSectionHeight(active ? contentEl.current.scrollHeight : 0);
  }, [active]);

  return (
    <div
      className="
        mb-3 sm:mb-4
        overflow-hidden
        rounded-lg
        border border-[var(--richblack-600)]
        bg-[var(--richblack-700)]
        text-[var(--richblack-5)]
        shadow-sm sm:shadow-md
      "
    >
      {/* ================= HEADER ================= */}
      <div
        onClick={() => handleActive(course._id)}
        className="
          flex cursor-pointer items-center justify-between
          gap-3
          px-3 py-3
          sm:px-4 sm:py-4
          transition-all duration-300
          hover:bg-[var(--richblack-600)]
        "
      >
        {/* Left */}
        <div className="flex min-w-0 items-center gap-2 sm:gap-3">
          <AiOutlineDown
            size={18}
            className={`flex-shrink-0 transition-transform duration-300
              ${active ? "rotate-180" : "rotate-0"}`}
          />

          <p
            className="
              text-sm sm:text-base md:text-lg
              font-semibold
              truncate
            "
          >
            {course?.sectionName}
          </p>
        </div>

        {/* Right Badge */}
        <span
          className="
            flex-shrink-0
            rounded-md
            bg-[var(--yellow-25)]
            px-2 py-0.5
            text-xs sm:text-sm
            font-medium
            text-[var(--richblack-900)]
          "
        >
          {course?.SubSection?.length || 0} lectures
        </span>
      </div>

      {/* ================= BODY ================= */}
      <div
        ref={contentEl}
        style={{ height: sectionHeight }}
        className="
          overflow-hidden
          bg-[var(--richblack-800)]
          transition-all duration-300 ease-in-out
        "
      >
        <div className="flex flex-col gap-2 px-3 py-3 sm:px-5 sm:py-4">
          {course?.SubSection?.map((subSec, index) => (
            <CourseSubSectionAccordion
              key={index}
              subSec={subSec}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
