import React, { useEffect, useState } from "react";
import { BiInfoCircle } from "react-icons/bi";
import { HiOutlineGlobeAlt } from "react-icons/hi";
import ReactMarkdown from "react-markdown";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

import ConfirmationModal from "../components/core/HomePage/common/ConfirmationModal";
import Footer from "../components/core/HomePage/common/Footer";
import RatingStars from "../components/core/HomePage/common/RatingStars";
import CourseAccordionBar from "../components/core/Course/CourseAccordion";
import CourseDetailsCard from "../components/core/Course/CourseDetailsCard";
import { formatDate } from "../services/formatDate";
import {
  fetchCourseDetails,
  enrollCourseWithoutPayment,
} from "../services/operations/courseDetailsAPI";
import GetAvgRating from "../utils/avgRating";
import Error from "./Error";

function CourseDetails() {
  const { user } = useSelector((state) => state.profile);
  const { token } = useSelector((state) => state.auth);
  const { loading } = useSelector((state) => state.profile);

  const navigate = useNavigate();
  const { courseId } = useParams();

  const [response, setResponse] = useState(null);
  const [confirmationModal, setConfirmationModal] = useState(null);
  const [avgReviewCount, setAvgReviewCount] = useState(0);
  const [isActive, setIsActive] = useState([]);
  const [totalNoOfLectures, setTotalNoOfLectures] = useState(0);

 
  useEffect(() => {
    (async () => {
      try {
        const res = await fetchCourseDetails(courseId);
        if (!res?.success) {
          setResponse({ success: false });
          return;
        }
        setResponse(res);
      } catch (error) {
        console.error("Could not fetch Course Details:", error.message);
        setResponse({ success: false });
      }
    })();
  }, [courseId]);

  const courseDetails = response?.data || {};
  const {
    courseName = "",
    courseDescription = "",
    thumbnail = "",
    price = 0,
    whatYouWillLearn = [],
    courseContent = [],
    ratingAndReviews = [],
    instructor = {},
    studentsEnrolled = [],
    createdAt = "",
  } = courseDetails;

  const totalDuration = response?.totalDuration || "0s";

  //  Avg Rating
  useEffect(() => {
    setAvgReviewCount(GetAvgRating(ratingAndReviews));
  }, [ratingAndReviews]);

  //  Total Lectures
  useEffect(() => {
    let lectures = 0;
    courseContent.forEach((sec) => {
      lectures += sec.SubSection?.length || 0;
    });
    setTotalNoOfLectures(lectures);
  }, [courseContent]);

  const handleActive = (id) => {
    setIsActive(
      isActive.includes(id)
        ? isActive.filter((e) => e !== id)
        : [...isActive, id]
    );
  };

  // ENROLL HANDLER (NO PAYMENT)
  const handleEnrollCourse = () => {
    if (!token) {
      setConfirmationModal({
        text1: "You are not logged in!",
        text2: "Please login to enroll in this course.",
        btn1Text: "Login",
        btn2Text: "Cancel",
        btn1Handler: () => navigate("/login"),
        btn2Handler: () => setConfirmationModal(null),
      });
      return;
    }

    enrollCourseWithoutPayment(courseId, token, navigate);
  };

  //  Loading
  if (loading || !response) {
    return (
      <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!response.success) {
    return <Error />;
  }

  return (
    <>
      {/* ================= HERO SECTION ================= */}
      <div className="relative w-full bg-[var(--richblack-800)]">
        <div className="mx-auto box-content px-4 lg:w-[1260px] 2xl:relative">
          <div className="mx-auto grid min-h-[450px] max-w-maxContentTab justify-items-center py-8 lg:mx-0 lg:justify-items-start lg:py-0 xl:max-w-[810px]">
            {/* Mobile Thumbnail */}
            <div className="relative block max-h-[30rem] lg:hidden">
              <div className="absolute bottom-0 left-0 h-full w-full shadow-[inset_0_-64px_36px_-28px_var(--richblack-800)]" />
              <img
                src={thumbnail}
                alt="course thumbnail"
                className="aspect-auto w-full"
              />
            </div>

            {/* Course Info */}
            <div className="z-30 my-5 flex flex-col gap-4 py-5 text-lg text-[var(--richblack-5)]">
              <p className="text-4xl font-bold sm:text-[42px]">
                {courseName}
              </p>
              <p className="text-[var(--richblack-200)]">
                {courseDescription}
              </p>

              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[var(--yellow-25)]">
                  {avgReviewCount}
                </span>
                <RatingStars
                  Review_Count={avgReviewCount}
                  Star_Size={24}
                />
                <span>({ratingAndReviews.length} reviews)</span>
                <span>{studentsEnrolled.length} students enrolled</span>
              </div>

              <p>
                Created By{" "}
                {`${instructor.firstName || ""} ${instructor.lastName || ""}`}
              </p>

              <div className="flex flex-wrap gap-5">
                <p className="flex items-center gap-2">
                  <BiInfoCircle /> Created at {formatDate(createdAt)}
                </p>
                <p className="flex items-center gap-2">
                  <HiOutlineGlobeAlt /> English
                </p>
              </div>
            </div>

            {/* Mobile Enroll Card */}
            <div className="flex w-full flex-col gap-4 border-y border-[var(--richblack-500)] py-4 lg:hidden">
              <p className="text-3xl font-semibold bg-amber-50">Free</p>
              <button
                className="bg-[var(--yellow-50)]"
                onClick={handleEnrollCourse}
              >
                Enroll Now
              </button>
            </div>
          </div>

          {/* Desktop Card */}
          <div className="right-[1rem] top-[60px] mx-auto hidden w-1/3 max-w-[410px] translate-y-24 lg:absolute lg:block">
            <CourseDetailsCard
              course={courseDetails}
              setConfirmationModal={setConfirmationModal}
              handleBuyCourse={handleEnrollCourse}
            />
          </div>
        </div>
      </div>

      {/* ================= CONTENT ================= */}
      <div className="mx-auto box-content px-4 text-[var(--richblack-5)] lg:w-[1260px]">
        <div className="mx-auto max-w-maxContentTab xl:max-w-[810px]">
          {/* What You'll Learn */}
          <div className="my-8 border border-[var(--richblack-600)] p-8">
            <p className="text-3xl font-semibold">What you'll learn</p>
            <div className="mt-5">
              <ReactMarkdown>
                {whatYouWillLearn.join("\n")}
              </ReactMarkdown>
            </div>
          </div>

          {/* Course Content */}
          <div>
            <p className="text-[28px] font-semibold">Course Content</p>
            <div className="flex justify-between py-2">
              <div className="flex gap-2">
                <span>{courseContent.length} sections</span>
                <span>{totalNoOfLectures} lectures</span>
                <span>{totalDuration}</span>
              </div>
              <button
                className="text-[var(--yellow-25)]"
                onClick={() => setIsActive([])}
              >
                Collapse all
              </button>
            </div>

            <div className="py-4">
              {courseContent.map((section, index) => (
                <CourseAccordionBar
                  key={index}
                  course={section}
                  isActive={isActive}
                  handleActive={handleActive}
                />
              ))}
            </div>

            {/* Author */}
            <div className="mb-12">
              <p className="text-[28px] font-semibold">Author</p>
              <div className="flex items-center gap-4 py-4">
                <img
                  src={
                    instructor.image ||
                    `https://api.dicebear.com/5.x/initials/svg?seed=${instructor.firstName}`
                  }
                  className="h-14 w-14 rounded-full"
                  alt="author"
                />
                <p className="text-lg">
                  {`${instructor.firstName || ""} ${instructor.lastName || ""}`}
                </p>
              </div>
              <p className="text-[var(--richblack-50)]">
                {instructor?.additionalDetails?.about || ""}
              </p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
      {confirmationModal && (
        <ConfirmationModal modalData={confirmationModal} />
      )}
    </>
  );
}

export default CourseDetails;
