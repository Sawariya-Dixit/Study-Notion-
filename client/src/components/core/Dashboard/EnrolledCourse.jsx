import { useEffect, useState } from "react"
import ProgressBar from "@ramonak/react-progress-bar"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"

import { getUserEnrolledCourses } from "../../../services/operations/profileAPI"

export default function EnrolledCourses() {
  const { token } = useSelector((state) => state.auth)
  const navigate = useNavigate()
  const [enrolledCourses, setEnrolledCourses] = useState(null)

  useEffect(() => {
    ;(async () => {
      try {
        const res = await getUserEnrolledCourses(token)
        setEnrolledCourses(res)
      } catch {
        console.log("Could not fetch enrolled courses.")
      }
    })()
  }, [])

  return (
    <>
      <h1 className="text-2xl sm:text-3xl font-semibold text-[var(--richblack-50)]">
        Enrolled Courses
      </h1>

      {!enrolledCourses ? (
        <div className="grid min-h-[60vh] place-items-center">
          <div className="spinner"></div>
        </div>
      ) : !enrolledCourses.length ? (
        <p className="mt-10 text-center text-[var(--richblack-5)]">
          You have not enrolled in any course yet.
        </p>
      ) : (
        <div className="mt-8">
          {/* ================= DESKTOP TABLE ================= */}
          <div className="hidden md:block">
            <div className="flex rounded-t-lg bg-[var(--richblack-500)] border border-[var(--richblack-700)]">
              <p className="w-[45%] px-5 py-3">Course</p>
              <p className="w-1/4 px-3 py-3">Duration</p>
              <p className="flex-1 px-3 py-3">Progress</p>
            </div>

            {enrolledCourses.map((course, i, arr) => (
              <div
                key={course._id}
                className={`flex items-center bg-[var(--richblack-800)] border-x border-b border-[var(--richblack-700)] ${
                  i === arr.length - 1 ? "rounded-b-lg" : ""
                }`}
              >
                {/* Course */}
                <div
                  className="flex w-[45%] cursor-pointer items-center gap-4 px-5 py-3"
                  onClick={() =>
                    navigate(
                      `/view-course/${course._id}/section/${course.courseContent?.[0]?._id}/sub-section/${course.courseContent?.[0]?.SubSection?.[0]?._id}`
                    )
                  }
                >
                  <img
                    src={course.thumbnail}
                    alt="course"
                    className="h-14 w-14 rounded-lg object-cover"
                  />
                  <div>
                    <p className="font-semibold text-[var(--richblack-5)]">
                      {course.courseName}
                    </p>
                    <p className="text-xs text-[var(--richblack-300)] line-clamp-2">
                      {course.courseDescription}
                    </p>
                  </div>
                </div>

                <div className="w-1/4 px-3 text-[var(--richblack-100)]">
                  {course.totalDuration}
                </div>

                <div className="flex w-1/5 flex-col gap-2 px-3">
                  <p className="text-sm">
                    {course.progressPercentage || 0}%
                  </p>
                  <ProgressBar
                    completed={course.progressPercentage || 0}
                    height="8px"
                    isLabelVisible={false}
                    bgColor="var(--caribbeangreen-100)"
                    baseBgColor="var(--richblack-700)"
                  />
                </div>
              </div>
            ))}
          </div>

          {/* ================= MOBILE CARDS ================= */}
          <div className="flex flex-col gap-4 md:hidden">
            {enrolledCourses.map((course) => (
              <div
                key={course._id}
                className="rounded-lg bg-[var(--richblack-800)] p-4 border border-[var(--richblack-700)]"
              >
                <div
                  className="flex gap-3 cursor-pointer"
                  onClick={() =>
                    navigate(
                      `/view-course/${course._id}/section/${course.courseContent?.[0]?._id}/sub-section/${course.courseContent?.[0]?.SubSection?.[0]?._id}`
                    )
                  }
                >
                  <img
                    src={course.thumbnail}
                    alt="course"
                    className="h-16 w-16 rounded-lg object-cover"
                  />
                  <div>
                    <p className="font-semibold text-[var(--richblack-5)]">
                      {course.courseName}
                    </p>
                    <p className="text-xs text-[var(--richblack-300)] line-clamp-2">
                      {course.courseDescription}
                    </p>
                  </div>
                </div>

                <div className="mt-4 flex flex-col gap-2">
                  <p className="text-sm text-[var(--richblack-100)]">
                    Duration: {course.totalDuration}
                  </p>

                  <p className="text-sm">
                    Progress: {course.progressPercentage || 0}%
                  </p>

                  <ProgressBar
                    completed={course.progressPercentage || 0}
                    height="8px"
                    isLabelVisible={false}
                    bgColor="var(--caribbeangreen-100)"
                    baseBgColor="var(--richblack-700)"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  )
}
