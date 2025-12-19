import { useEffect, useState } from "react"
import { VscAdd } from "react-icons/vsc"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"

import { fetchInstructorCourses } from "../../../services/operations/courseDetailsAPI"
import IconBtn from "../HomePage/common/IconBtn"
import CoursesTable from "./InstructorCourses/CoursesTable"

export default function MyCourses() {
  const { token } = useSelector((state) => state.auth)
  const navigate = useNavigate()
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true)
      const result = await fetchInstructorCourses(token)
      if (result) {
        setCourses(result)
      }
      setLoading(false)
    }
    fetchCourses()
  }, [token])

  return (
    <div className="text-[var(--richblack-5)]">
      {/* ================= HEADER ================= */}
      <div
        className="
          mb-8 sm:mb-14
          flex flex-col gap-4
          sm:flex-row sm:items-center sm:justify-between
        "
      >
        <h1 className="text-2xl sm:text-3xl font-medium">
          My Courses
        </h1>

        <IconBtn
          text="Add Course"
          onClick={() => navigate("/dashboard/add-course")}
          customClasses="
            w-full sm:w-auto
            bg-[var(--yellow-50)]
            text-[var(--richblack-900)]
            hover:bg-[var(--yellow-100)]
          "
        >
          <VscAdd />
        </IconBtn>
      </div>

      {/* ================= CONTENT ================= */}
      {loading ? (
        <div className="grid min-h-[40vh] place-items-center">
          <div className="spinner"></div>
        </div>
      ) : courses.length === 0 ? (
        <p className="text-center text-[var(--richblack-300)]">
          You have not created any courses yet.
        </p>
      ) : (
        <div
          className="
            rounded-lg
            border border-[var(--richblack-700)]
            bg-[var(--richblack-800)]
            overflow-x-auto
          "
        >
          {/* Desktop & Tablet Table */}
          <CoursesTable courses={courses} setCourses={setCourses} />
        </div>
      )}
    </div>
  )
}
