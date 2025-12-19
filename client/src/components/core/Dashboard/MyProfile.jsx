import { RiEditBoxLine } from "react-icons/ri"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"

import { formattedDate } from "../../../utils/dateFormatter"
import IconBtn from "../HomePage/common/IconBtn"

export default function MyProfile() {
  const { user } = useSelector((state) => state.profile)
  const navigate = useNavigate()

  return (
    <>
      {/* ================= PAGE TITLE ================= */}
      <h1 className="mb-8 sm:mb-14 text-2xl sm:text-3xl font-medium text-[var(--richblack-5)]">
        My Profile
      </h1>

      {/* ================= PROFILE CARD ================= */}
      <div
        className="
          flex flex-col gap-6
          sm:flex-row sm:items-center sm:justify-between
          rounded-md border border-[var(--richblack-700)]
          bg-[var(--richblack-800)]
          p-6 sm:p-8 sm:px-12
        "
      >
        <div className="flex items-center gap-4">
          <img
            src={user?.image}
            alt={`profile-${user?.firstName}`}
            className="
              aspect-square
              w-16 sm:w-[78px]
              rounded-full
              object-cover
            "
          />
          <div className="space-y-1">
            <p className="text-base sm:text-lg font-semibold text-[var(--richblack-5)]">
              {user?.firstName} {user?.lastName}
            </p>
            <p className="text-xs sm:text-sm text-[var(--richblack-300)]">
              {user?.email}
            </p>
          </div>
        </div>

        <IconBtn
          text="Edit"
          onClick={() => navigate("/dashboard/settings")}
          customClasses="w-full sm:w-auto"
        >
          <RiEditBoxLine />
        </IconBtn>
      </div>

      {/* ================= ABOUT SECTION ================= */}
      <div
        className="
          my-8 sm:my-10
          flex flex-col gap-6 sm:gap-10
          rounded-md border border-[var(--richblack-700)]
          bg-[var(--richblack-800)]
          p-6 sm:p-8 sm:px-12
        "
      >
        <div className="flex items-center justify-between">
          <p className="text-base sm:text-lg font-semibold text-[var(--richblack-5)]">
            About
          </p>
          <IconBtn
            text="Edit"
            onClick={() => navigate("/dashboard/settings")}
          >
            <RiEditBoxLine />
          </IconBtn>
        </div>

        <p
          className={`text-sm leading-relaxed font-medium ${
            user?.additionalDetails?.about
              ? "text-[var(--richblack-5)]"
              : "text-[var(--richblack-400)]"
          }`}
        >
          {user?.additionalDetails?.about ??
            "Write something about yourself"}
        </p>
      </div>

      {/* ================= PERSONAL DETAILS ================= */}
      <div
        className="
          my-8 sm:my-10
          flex flex-col gap-6 sm:gap-10
          rounded-md border border-[var(--richblack-700)]
          bg-[var(--richblack-800)]
          p-6 sm:p-8 sm:px-12
        "
      >
        <div className="flex items-center justify-between">
          <p className="text-base sm:text-lg font-semibold text-[var(--richblack-5)]">
            Personal Details
          </p>
          <IconBtn
            text="Edit"
            onClick={() => navigate("/dashboard/settings")}
          >
            <RiEditBoxLine />
          </IconBtn>
        </div>

        {/* Details Grid */}
        <div
          className="
            grid grid-cols-1 gap-6
            sm:grid-cols-2 sm:gap-x-12
            max-w-[600px]
          "
        >
          {/* Left Column */}
          <Detail label="First Name" value={user?.firstName} />
          <Detail label="Last Name" value={user?.lastName} />
          <Detail label="Email" value={user?.email} />
          <Detail
            label="Phone Number"
            value={
              user?.additionalDetails?.contactNumber ?? "Add Contact Number"
            }
          />
          <Detail
            label="Gender"
            value={user?.additionalDetails?.gender ?? "Add Gender"}
          />
          <Detail
            label="Date Of Birth"
            value={
              formattedDate(user?.additionalDetails?.dateOfBirth) ??
              "Add Date Of Birth"
            }
          />
        </div>
      </div>
    </>
  )
}

/* ================= SMALL REUSABLE COMPONENT ================= */
function Detail({ label, value }) {
  return (
    <div>
      <p className="mb-1 text-xs sm:text-sm text-[var(--richblack-600)]">
        {label}
      </p>
      <p className="text-sm font-medium text-[var(--richblack-5)]">
        {value}
      </p>
    </div>
  )
}
