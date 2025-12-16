import { useEffect, useRef, useState } from "react";
import { AiOutlineDown } from "react-icons/ai";
import CourseSubSectionAccordion from "./CourseSubSectionAccordion";

export default function CourseAccordionBar({ course, isActive, handleActive }) {
  const contentEl = useRef(null);

  const [active, setActive] = useState(false);

  useEffect(() => {
    setActive(isActive?.includes(course._id));
  }, [isActive, course._id]);

  const [sectionHeight, setSectionHeight] = useState(0);
  useEffect(() => {
    setSectionHeight(active ? contentEl.current.scrollHeight : 0);
  }, [active]);

  return (
    <div
      className="
        overflow-hidden 
        border border-[var(--richblack-600)]
        rounded-lg 
        bg-[var(--richblack-700)] 
        text-[var(--richblack-5)]
        mb-4 shadow-md
      "
    >
      {/* Accordion Header */}
      <div
        className="
          flex cursor-pointer items-center justify-between 
          px-5 py-4 transition-all duration-300 
          hover:bg-[var(--richblack-600)]
        "
        onClick={() => handleActive(course._id)}
      >
        <div className="flex items-center gap-3">
          <AiOutlineDown
            className={`transition-transform duration-300 ${
              active ? "rotate-180" : "rotate-0"
            } text-[var(--richblack-5)]`}
            size={20}
          />
          <p className="font-semibold text-lg text-[var(--richblack-5)]">
            {course?.sectionName}
          </p>
        </div>

        <span
          className="
            text-sm font-medium px-2 py-1 rounded 
            bg-[var(--yellow-25)] 
            text-[var(--richblack-900)]
          "
        >
          {`${course?.SubSection?.length || 0} lecture(s)`}
        </span>
      </div>

      {/* Accordion Body */}
      <div
        ref={contentEl}
        style={{ height: sectionHeight }}
        className="
          overflow-hidden 
          transition-all duration-300 ease-in-out 
          bg-[var(--richblack-800)]
        "
      >
        <div className="flex flex-col gap-2 px-5 py-4">
          {course?.SubSection?.map((subSec, index) => (
            <CourseSubSectionAccordion subSec={subSec} key={index} />
          ))}
        </div>
      </div>
    </div>
  );
}
