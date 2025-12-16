import React from "react";
import CTAButton from "../../../components/core/HomePage/Button";
import { FaArrowRight } from "react-icons/fa";
import Instructor from "../../../assets/images/Instructor.png";
import HighlightText from "./HighLightText";

const InstructorSection = () => {
  return (
    <div className="mx-auto w-11/12 max-w-maxContent py-10 lg:py-20">
      <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-20">
        {/* Instructor Image */}
        <div className="lg:w-1/2 flex justify-center lg:justify-start">
          <img
            src={Instructor}
            alt="Instructor"
            className="shadow-white shadow-[-20px_-20px_0_0] rounded-lg"
          />
        </div>

        {/* Text Section */}
        <div className="lg:w-1/2 flex flex-col gap-6">
          <h1 className="text-4xl font-semibold lg:w-3/4">
            Become an <HighlightText text="Instructor" />
          </h1>

          <p className="text-[var(--richblack-300)] text-[16px] font-medium text-justify lg:w-11/12">
            Instructors from around the world teach millions of students on
            StudyNotion. We provide the tools and skills to teach what you love.
          </p>

          <div className="w-fit">
            <CTAButton active={true} linkto="/signup">
              <div className="flex items-center gap-3">
                Start Teaching Today <FaArrowRight />
              </div>
            </CTAButton>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstructorSection;
