import React from "react";
import copy from "copy-to-clipboard";
import { toast } from "react-hot-toast";
import { BsFillCaretRightFill } from "react-icons/bs";
import { FaShareSquare } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { addToCart } from "../../../slices/cartSlice";
import { ACCOUNT_TYPE } from "../../../utils/constants";

function CourseDetailsCard({ course, setConfirmationModal, handleBuyCourse }) {
  const { user } = useSelector((state) => state.profile);
  const { token } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    thumbnail: ThumbnailImage,
    price: CurrentPrice,
    _id: courseId,
    studentsEnrolled = [],
    instructions = [],
    courseName = "",
  } = course || {};

  const handleShare = () => {
    copy(window.location.href);
    toast.success("Link copied to clipboard");
  };

  const handleAddToCart = () => {
    if (user?.accountType === ACCOUNT_TYPE.INSTRUCTOR) {
      toast.error("You are an Instructor. You can't buy a course.");
      return;
    }
    if (token) {
      dispatch(addToCart(course));
      return;
    }
    setConfirmationModal({
      text1: "You are not logged in!",
      text2: "Please login to add To Cart",
      btn1Text: "Login",
      btn2Text: "Cancel",
      btn1Handler: () => navigate("/login"),
      btn2Handler: () => setConfirmationModal(null),
    });
  };

  return (
    <div
      className="
        flex flex-col gap-4 rounded-lg 
        bg-[var(--richblack-700)] 
        p-4 
        text-[var(--richblack-5)]
        shadow-md 
        md:w-full
      "
    >
      {/* Course Image */}
      <img
        src={ThumbnailImage}
        alt={courseName}
        className="w-full max-h-[300px] min-h-[180px] rounded-2xl object-cover md:max-w-full"
      />

      <div className="flex flex-col gap-4 px-2 md:px-4">
        <div className="text-3xl font-semibold text-[var(--pure-greys-5)]">
          Rs. {CurrentPrice}
        </div>

        <div className="flex flex-col gap-3 md:flex-row md:gap-4">
          <button
            className="
              yellowButton 
              flex-1 
              bg-[var(--yellow-50)] 
              text-[var(--richblack-900)]
            "
            onClick={
              user && studentsEnrolled.includes(user?._id)
                ? () => navigate("/dashboard/enrolled-courses")
                : handleBuyCourse
            }
          >
            {user && studentsEnrolled.includes(user?._id)
              ? "Go To Course"
              : "Buy Now"}
          </button>

          {(!user || !studentsEnrolled.includes(user?._id)) && (
            <button
              onClick={handleAddToCart}
              className="
                blackButton 
                flex-1 
                bg-[var(--richblack-900)] 
                text-[var(--richblack-5)]
              "
            >
              Add to Cart
            </button>
          )}
        </div>

        <p className="text-center text-sm text-[var(--richblack-25)]">
          30-Day Money-Back Guarantee
        </p>

        <div>
          <p className="my-2 text-xl font-semibold text-[var(--pure-greys-5)]">
            This Course Includes :
          </p>

          <div className="flex flex-col gap-2 text-sm text-[var(--caribbeangreen-100)]">
            {instructions.map((item, i) => (
              <p key={i} className="flex items-start gap-2">
                <BsFillCaretRightFill
                  className="mt-0.5 text-[var(--yellow-25)]"
                />
                <span>{item}</span>
              </p>
            ))}
          </div>
        </div>

        <div className="text-center">
          <button
            className="mx-auto flex items-center gap-2 py-2 text-[var(--yellow-100)]"
            onClick={handleShare}
          >
            <FaShareSquare size={16} /> Share
          </button>
        </div>
      </div>
    </div>
  );
}

export default CourseDetailsCard;
