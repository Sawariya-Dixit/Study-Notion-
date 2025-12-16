import { useEffect, useState } from "react"
import ProgressBar from "@ramonak/react-progress-bar"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"

import { getUserEnrolledCourses } from "../../../services/operations/profileAPI"

export default function EnrolledCourses() {
  const { token } = useSelector((state) => state.auth)
  const navigate = useNavigate()

  const [enrolledCourses, setEnrolledCourses] = useState(null)

  const getEnrolledCourses = async () => {
    try {
      const res = await getUserEnrolledCourses(token)
      setEnrolledCourses(res)
    } catch (error) {
      console.log("Could not fetch enrolled courses.")
    }
  }

  useEffect(() => {
    getEnrolledCourses()
  }, [])

  return (
    <>
      {/* Heading */}
      <div className="text-3xl text-[var(--richblack-50)]">
        Enrolled Courses
      </div>

      {/* Loading */}
      {!enrolledCourses ? (
        <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
          <div className="spinner"></div>
        </div>
      ) : !enrolledCourses.length ? (
        /* Empty state */
        <p className="grid h-[10vh] w-full place-content-center text-[var(--richblack-5)]">
          You have not enrolled in any course yet.
        </p>
      ) : (
        <div className="my-8 text-[var(--richblack-5)]">
          {/* Table Head */}
          <div className="flex rounded-t-lg bg-[var(--richblack-500)] border border-[var(--richblack-700)]">
            <p className="w-[45%] px-5 py-3">Course Name</p>
            <p className="w-1/4 px-2 py-3">Duration</p>
            <p className="flex-1 px-2 py-3">Progress</p>
          </div>

          {/* Rows */}
          {enrolledCourses.map((course, i, arr) => (
            <div
              key={course._id}
              className={`flex items-center border-x border-b border-[var(--richblack-700)] bg-[var(--richblack-800)] ${
                i === arr.length - 1 ? "rounded-b-lg" : ""
              }`}
            >
              {/* Course Info */}
              <div
                className="flex w-[45%] cursor-pointer items-center gap-4 px-5 py-3"
                onClick={() => {
                  navigate(
                    `/view-course/${course?._id}/section/${course.courseContent?.[0]?._id}/sub-section/${course.courseContent?.[0]?.SubSection?.[0]?._id}`
                  )
                }}
              >
                <img
                  src={course.thumbnail}
                  alt="course"
                  className="h-14 w-14 rounded-lg object-cover"
                />
                <div className="flex max-w-xs flex-col gap-2">
                  <p className="font-semibold text-[var(--richblack-5)]">
                    {course.courseName}
                  </p>
                  <p className="text-xs text-[var(--richblack-300)]">
                    {course.courseDescription.length > 50
                      ? `${course.courseDescription.slice(0, 50)}...`
                      : course.courseDescription}
                  </p>
                </div>
              </div>

              {/* Duration */}
              <div className="w-1/4 px-2 py-3 text-[var(--richblack-100)]">
                {course?.totalDuration}
              </div>

              {/* Progress */}
              <div className="flex w-1/5 flex-col gap-2 px-2 py-3">
                <p className="text-sm text-[var(--richblack-100)]">
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
      )}
    </>
  )
}
