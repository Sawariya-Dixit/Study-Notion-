import { useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "react-hot-toast"
import { IoAddCircleOutline } from "react-icons/io5"
import { MdNavigateNext } from "react-icons/md"
import { useDispatch, useSelector } from "react-redux"

import {
  createSection,
  updateSection,
} from "../../../../../services/operations/courseDetailsAPI"

import {
  setCourse,
  setEditCourse,
  setStep,
} from "../../../../../slices/courseSlice"

import IconBtn from "../../../HomePage/common/IconBtn"
import NestedView from "./NestedView"

export default function CourseBuilderForm() {
  const { register, handleSubmit, setValue, formState: { errors } } = useForm()
  const { course } = useSelector((state) => state.course) || {}
  const { token } = useSelector((state) => state.auth)

  const [loading, setLoading] = useState(false)
  const [editSectionName, setEditSectionName] = useState(null)
  const dispatch = useDispatch()

  // Helper: normalize possible API response shapes
  const getPayload = (result) => {
    if (!result) return null
    // common shapes: result.data (new section or updated section or course),
    // result.data.data (sometimes), or result (rare)
    if (result.data) return result.data
    if (result.data?.data) return result.data.data
    return result
  }

  // ------------------ SUBMIT HANDLER ------------------
  const onSubmit = async (data) => {
    setLoading(true)
    let result

    try {
      // 🔹 EDIT SECTION
      if (editSectionName) {
        result = await updateSection(
          {
            sectionName: data.sectionName,
            sectionId: editSectionName,
            courseId: course?._id,
          },
          token
        )

        const payload = getPayload(result)
        // payload could be the updated section object OR could be the whole updated course
        if (payload) {
          // If backend returned entire updated course (has courseContent), use it directly
          if (payload.courseContent && Array.isArray(payload.courseContent)) {
            dispatch(setCourse(payload))
          } else {
            // Otherwise treat payload as the updated section and replace in existing array
            const prevSections = Array.isArray(course?.courseContent) ? course.courseContent : []
            const updatedSections = prevSections.map((sec) =>
              sec._id === editSectionName ? payload : sec
            )

            dispatch(
              setCourse({
                ...course,
                courseContent: updatedSections,
              })
            )
          }
        }
      } else {
        // 🔹 CREATE NEW SECTION
        result = await createSection(
          {
            sectionName: data.sectionName,
            courseId: course?._id,
          },
          token
        )

        const payload = getPayload(result)
        if (payload) {
          // payload could be full updated course OR only new section object
          if (payload.courseContent && Array.isArray(payload.courseContent)) {
            // backend returned full course
            dispatch(setCourse(payload))
          } else {
            // backend returned the new section object
            const prevSections = Array.isArray(course?.courseContent) ? course.courseContent : []
            dispatch(
              setCourse({
                ...course,
                courseContent: [...prevSections, payload],
              })
            )
          }
        }
      }

      // reset form + edit state
      setEditSectionName(null)
      setValue("sectionName", "")
    } catch (err) {
      console.error("Section submit error:", err)
      toast.error("Something went wrong. Try again.")
    } finally {
      setLoading(false)
    }
  }

  const cancelEdit = () => {
    setEditSectionName(null)
    setValue("sectionName", "")
  }

  const handleChangeEditSectionName = (sectionId, sectionName) => {
    if (editSectionName === sectionId) {
      cancelEdit()
      return
    }
    setEditSectionName(sectionId)
    setValue("sectionName", sectionName)
  }

  const goToNext = () => {
    if (!course?.courseContent?.length) {
      toast.error("Please add at least one section")
      return
    }
    if (
      course.courseContent.some(
        (sec) => !sec.SubSection || sec.SubSection.length === 0
      )
    ) {
      toast.error("Please add at least one lecture in each section")
      return
    }
    dispatch(setStep(3))
  }

  const goBack = () => {
    dispatch(setStep(1))
    dispatch(setEditCourse(true))
  }

  return (
    <div className="space-y-8 rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-6">
      <p className="text-2xl font-semibold text-richblack-5">Course Builder</p>

      {/* FORM */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="flex flex-col space-y-2">
          <label className="text-sm text-richblack-5" htmlFor="sectionName">
            Section Name <sup className="text-pink-200">*</sup>
          </label>
          <input
            id="sectionName"
            disabled={loading}
            placeholder="Add a section to build your course"
            {...register("sectionName", { required: true })}
            className="form-style w-full"
          />
          {errors.sectionName && (
            <span className="ml-2 text-xs tracking-wide text-pink-200">
              Section name is required
            </span>
          )}
        </div>

        <div className="flex items-end gap-x-4">
          <IconBtn
            type="submit"
            disabled={loading}
            text={editSectionName ? "Edit Section Name" : "Create Section"}
            outline={true}
          >
            <IoAddCircleOutline size={20} className="text-yellow-50" />
          </IconBtn>

          {editSectionName && (
            <button
              type="button"
              onClick={cancelEdit}
              className="text-sm text-richblack-300 underline"
            >
              Cancel Edit
            </button>
          )}
        </div>
      </form>

      {/* SECTIONS LIST */}
      {course?.courseContent?.length > 0 && (
        <NestedView handleChangeEditSectionName={handleChangeEditSectionName} />
      )}

      {/* BUTTONS */}
      <div className="flex justify-end gap-x-3">
        <button
          onClick={goBack}
          className="flex cursor-pointer items-center gap-x-2 rounded-md bg-richblack-300 py-[8px] px-[20px] font-semibold text-richblack-900"
        >
          Back
        </button>

        <IconBtn disabled={loading} text="Next" onClick={goToNext}>
          <MdNavigateNext />
        </IconBtn>
      </div>
    </div>
  )
}
