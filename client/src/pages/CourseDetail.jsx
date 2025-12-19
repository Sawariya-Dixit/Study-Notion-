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

  // ================= FETCH COURSE =================
  useEffect(() => {
    (async () => {
      try {
        const res = await fetchCourseDetails(courseId);
        if (!res?.success) {
          setResponse({ success: false });
          return;
        }
        setResponse(res);
      } catch {
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

  // ================= AVG RATING =================
  useEffect(() => {
    setAvgReviewCount(GetAvgRating(ratingAndReviews));
  }, [ratingAndReviews]);

  // ================= TOTAL LECTURES =================
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

  // ================= ENROLL =================
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

  // ================= LOADING =================
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
      {/* ================= HERO ================= */}
      <div className="bg-[var(--richblack-800)] px-4">
        <div className="mx-auto max-w-maxContent grid lg:grid-cols-[2fr_1fr] gap-8 py-8 lg:py-16">

          {/* LEFT */}
          <div className="flex flex-col gap-4 text-[var(--richblack-5)]">
            {/* Mobile Thumbnail */}
            <img
              src={thumbnail}
              alt="course"
              className="w-full rounded-lg lg:hidden"
            />

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold">
              {courseName}
            </h1>

            <p className="text-sm sm:text-base text-[var(--richblack-200)]">
              {courseDescription}
            </p>

            <div className="flex flex-wrap items-center gap-2 text-sm">
              <span className="text-[var(--yellow-25)] font-medium">
                {avgReviewCount}
              </span>
              <RatingStars Review_Count={avgReviewCount} Star_Size={20} />
              <span>({ratingAndReviews.length} reviews)</span>
              <span>{studentsEnrolled.length} students</span>
            </div>

            <p className="text-sm">
              Created By{" "}
              <span className="font-medium">
                {instructor.firstName} {instructor.lastName}
              </span>
            </p>

            <div className="flex flex-wrap gap-4 text-sm">
              <p className="flex items-center gap-2">
                <BiInfoCircle /> {formatDate(createdAt)}
              </p>
              <p className="flex items-center gap-2">
                <HiOutlineGlobeAlt /> English
              </p>
            </div>

            {/* Mobile Enroll */}
            <div className="mt-4 flex flex-col gap-3 border-y border-[var(--richblack-600)] py-4 lg:hidden">
              <p className="text-2xl font-semibold">Free</p>
              <button
                className="bg-[var(--yellow-50)] py-2 rounded-md font-semibold"
                onClick={handleEnrollCourse}
              >
                Enroll Now
              </button>
            </div>
          </div>

          {/* RIGHT CARD (Desktop) */}
          <div className="hidden lg:block">
            <CourseDetailsCard
              course={courseDetails}
              setConfirmationModal={setConfirmationModal}
              handleBuyCourse={handleEnrollCourse}
            />
          </div>
        </div>
      </div>

      {/* ================= CONTENT ================= */}
      <div className="px-4">
        <div className="mx-auto max-w-maxContent text-[var(--richblack-5)]">

          {/* What you'll learn */}
          <div className="my-8 border border-[var(--richblack-600)] p-5 sm:p-8 rounded-md">
            <p className="text-xl sm:text-2xl font-semibold">
              What you'll learn
            </p>
            <div className="mt-4 text-sm sm:text-base">
              <ReactMarkdown>
                {whatYouWillLearn.join("\n")}
              </ReactMarkdown>
            </div>
          </div>

          {/* Course Content */}
          <div>
            <p className="text-xl sm:text-2xl font-semibold">Course Content</p>

            <div className="flex flex-wrap justify-between gap-2 py-3 text-sm">
              <div className="flex flex-wrap gap-3">
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
          </div>

          {/* Author */}
          <div className="my-10">
            <p className="text-xl sm:text-2xl font-semibold">Author</p>
            <div className="flex items-center gap-4 py-4">
              <img
                src={
                  instructor.image ||
                  `https://api.dicebear.com/5.x/initials/svg?seed=${instructor.firstName}`
                }
                className="h-14 w-14 rounded-full"
                alt="author"
              />
              <p className="text-base sm:text-lg">
                {instructor.firstName} {instructor.lastName}
              </p>
            </div>
            <p className="text-sm sm:text-base text-[var(--richblack-50)]">
              {instructor?.additionalDetails?.about || ""}
            </p>
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
