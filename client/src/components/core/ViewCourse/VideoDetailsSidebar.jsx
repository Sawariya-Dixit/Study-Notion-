import { useEffect, useState } from "react";
import { BsChevronDown } from "react-icons/bs";
import { IoIosArrowBack } from "react-icons/io";
import { useSelector } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import IconBtn from "../HomePage/common/IconBtn";

export default function VideoDetailsSidebar({ setReviewModal }) {
  const [activeStatus, setActiveStatus] = useState("");
  const [videoBarActive, setVideoBarActive] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const { sectionId, subSectionId } = useParams();

  const {
    courseSectionData = [],
    courseEntireData = {},
    totalNoOfLectures = 0,
    completedVideo = [],
  } = useSelector((state) => state.viewCourse || {});

  // Set active section/subsection on path change
useEffect(() => {


  if (!courseSectionData.length) return;

  const secIndex = courseSectionData.findIndex(
    (s) => s._id === sectionId
  );

  const subIndex = courseSectionData[secIndex]?.SubSection?.findIndex(
    (ss) => ss._id === subSectionId
  );

}, [courseSectionData, location.pathname]);


  return (
    <div className="flex h-[calc(100vh-3.5rem)] w-[320px] flex-col bg-richblack-800">
      {/* Header */}
      <div className="border-b border-richblack-600 p-4 text-white">
        <div className="flex items-center justify-between">
          <div
            onClick={() => navigate("/dashboard/enrolled-courses")}
            className="cursor-pointer rounded-full bg-richblack-100 p-1 text-black"
          >
            <IoIosArrowBack size={24} />
          </div>
          <IconBtn text="Add Review" onClick={() => setReviewModal(true)} />
        </div>

        <div className="mt-3">
          <p className="font-bold">{courseEntireData?.courseName || "Course Name"}</p>
          <p className="text-sm text-richblack-400">
            {completedVideo?.length || 0} / {totalNoOfLectures || 0}
          </p>
        </div>
      </div>

      {/* Sections */}
      <div className="overflow-y-auto">
        {courseSectionData?.map((course) => (
          <div key={course._id}>
            {/* Section */}
            <div
              onClick={() => setActiveStatus(course._id)}
              className="flex justify-between bg-richblack-600 px-4 py-3 text-white cursor-pointer"
            >
              <p>{course.sectionName}</p>
              <BsChevronDown
                className={`transition ${activeStatus === course._id ? "rotate-180" : ""}`}
              />
            </div>

            {/* SubSections */}
            {activeStatus === course._id &&
              course.SubSection?.map((topic) => (
                <div
                  key={topic._id}
                  onClick={() => {
                    navigate(
                      `/view-course/${courseEntireData?._id}/section/${course._id}/sub-section/${topic._id}`
                    );
                    setVideoBarActive(topic._id);
                  }}
                  className={`flex gap-3 px-6 py-2 cursor-pointer ${
                    videoBarActive === topic._id
                      ? "bg-yellow-200 text-black"
                      : "text-white hover:bg-richblack-700"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={completedVideo?.includes(topic._id)}
                    readOnly
                  />
                  {topic.title}
                </div>
              ))}
          </div>
        ))}
      </div>
    </div>
  );
}
