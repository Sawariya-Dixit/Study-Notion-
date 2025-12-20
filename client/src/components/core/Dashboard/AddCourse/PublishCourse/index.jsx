import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"

import { editCourseDetails } from "../../../../../services/operations/courseDetailsAPI"
import { resetCourseState, setStep } from "../../../../../slices/courseSlice"
import { COURSE_STATUS } from "../../../../../utils/constants"
import IconBtn from "../../../HomePage/common/IconBtn"

export default function PublishCourse() {
  const { register, handleSubmit, setValue, getValues } = useForm()

  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { token } = useSelector((state) => state.auth)
  const { course } = useSelector((state) => state.course)

  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (course?.status === COURSE_STATUS.PUBLISHED) {
      setValue("public", true)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const goBack = () => {
    dispatch(setStep(2))
  }

  const goToCourses = () => {
    dispatch(resetCourseState())
    navigate("/dashboard/my-courses")
  }

  const handleCoursePublish = async () => {
    // Form unchanged → no API call
    if (
      (course?.status === COURSE_STATUS.PUBLISHED &&
        getValues("public") === true) ||
      (course?.status === COURSE_STATUS.DRAFT &&
        getValues("public") === false)
    ) {
      goToCourses()
      return
    }

    const formData = new FormData()
    formData.append("courseId", course._id)

    const courseStatus = getValues("public")
      ? COURSE_STATUS.PUBLISHED
      : COURSE_STATUS.DRAFT

    formData.append("status", courseStatus)

    try {
      setLoading(true)
      const result = await editCourseDetails(formData, token)
      if (result) {
        goToCourses()
      }
    } catch (error) {
      console.error("Publish error:", error)
    } finally {
      setLoading(false)
    }
  }

  const onSubmit = () => {
    handleCoursePublish()
  }

  return (
    <div
      className="
        rounded-md
        border
        border-[var(--richblack-700)]
        bg-[var(--richblack-800)]
        p-6
      "
    >
      {/* TITLE */}
      <p className="text-2xl font-semibold text-[var(--richblack-5)]">
        Publish Settings
      </p>

      <form onSubmit={handleSubmit(onSubmit)}>
        {/* CHECKBOX */}
        <div className="my-6 mb-8">
          <label
            htmlFor="public"
            className="inline-flex items-center text-lg"
          >
            <input
              type="checkbox"
              id="public"
              {...register("public")}
              className="
                h-4
                w-4
                rounded
                border
                border-[var(--pure-greys-300)]
                bg-[var(--richblack-500)]
                text-[var(--richblack-400)]
                focus:ring-2
                focus:ring-[var(--richblack-5)]
              "
            />
            <span className="ml-2 text-[var(--richblack-400)]">
              Make this course public
            </span>
          </label>
        </div>

        {/* BUTTONS */}
        <div className="ml-auto flex max-w-max items-center gap-x-4">
          <button
            type="button"
            disabled={loading}
            onClick={goBack}
            className="
              flex
              items-center
              gap-x-2
              rounded-md
              bg-[var(--richblack-300)]
              py-2
              px-5
              font-semibold
              text-[var(--richblack-900)]
              hover:bg-[var(--richblack-200)]
              transition
            "
          >
            Back
          </button>

          <IconBtn
            type="submit"
            disabled={loading}
            text={loading ? "Saving..." : "Save Changes"}
          />
        </div>
      </form>
    </div>
  )
}
