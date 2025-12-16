import React from "react";

// Importing React Icons
import { HiUsers } from "react-icons/hi";
import { ImTree } from "react-icons/im";

const CourseCard = ({ cardData, currentCard, setCurrentCard }) => {
  const isActive = currentCard === cardData?.heading;

  return (
    <div
      className={`w-[360px] lg:w-[30%] h-[300px] box-border cursor-pointer 
        ${isActive 
          ? "bg-[var(--white)] shadow-[12px_12px_0_0] shadow-[var(--yellow-50)]" 
          : "bg-[var(--richblack-800)] text-[var(--richblack-25)]"
        }`}
      onClick={() => setCurrentCard(cardData?.heading)}
    >
      <div
        className="border-b-[2px] border-dashed p-6 h-[80%] flex flex-col gap-3"
        style={{ borderColor: isActive ? "var(--yellow-50)" : "var(--richblack-400)" }}
      >
        <div
          className={`font-semibold text-[20px] ${isActive ? "text-[var(--richblack-800)]" : "text-[var(--richblack-25)]"}`}
        >
          {cardData?.heading}
        </div>
        <div className="text-[var(--richblack-400)]">{cardData?.description}</div>
      </div>

      <div
        className={`flex justify-between px-6 py-3 font-medium ${
          isActive ? "text-[var(--blue-300)]" : "text-[var(--richblack-300)]"
        }`}
      >
        {/* Level */}
        <div className="flex items-center gap-2 text-[16px]">
          <HiUsers />
          <p>{cardData?.level}</p>
        </div>

        {/* Flow Chart */}
        <div className="flex items-center gap-2 text-[16px]">
          <ImTree />
          <p>{cardData?.lessionNumber} Lesson</p>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
