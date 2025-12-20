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
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm()

  const { course } = useSelector((state) => state.course) || {}
  const { token } = useSelector((state) => state.auth)

  const [loading, setLoading] = useState(false)
  const [editSectionName, setEditSectionName] = useState(null)

  const dispatch = useDispatch()

  // helper
  const getPayload = (result) => {
    if (!result) return null
    if (result.data) return result.data
    if (result.data?.data) return result.data.data
    return result
  }

  // submit
  const onSubmit = async (data) => {
    setLoading(true)
    let result

    try {
      if (editSectionName) {
        // EDIT SECTION
        result = await updateSection(
          {
            sectionName: data.sectionName,
            sectionId: editSectionName,
            courseId: course?._id,
          },
          token
        )

        const payload = getPayload(result)

        if (payload) {
          if (payload.courseContent) {
            dispatch(setCourse(payload))
          } else {
            const updatedSections =
              course?.courseContent?.map((sec) =>
                sec._id === editSectionName ? payload : sec
              ) || []

            dispatch(
              setCourse({
                ...course,
                courseContent: updatedSections,
              })
            )
          }
        }
      } else {
        // CREATE SECTION
        result = await createSection(
          {
            sectionName: data.sectionName,
            courseId: course?._id,
          },
          token
        )

        const payload = getPayload(result)

        if (payload) {
          if (payload.courseContent) {
            dispatch(setCourse(payload))
          } else {
            dispatch(
              setCourse({
                ...course,
                courseContent: [
                  ...(course?.courseContent || []),
                  payload,
                ],
              })
            )
          }
        }
      }

      setEditSectionName(null)
      setValue("sectionName", "")
    } catch (error) {
      console.error(error)
      toast.error("Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  const cancelEdit = () => {
    setEditSectionName(null)
    setValue("sectionName", "")
  }

  const handleChangeEditSectionName = (id, name) => {
    if (editSectionName === id) {
      cancelEdit()
      return
    }
    setEditSectionName(id)
    setValue("sectionName", name)
  }

  const goNext = () => {
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
    <div
      className="
        space-y-6 sm:space-y-8
        rounded-md border
        border-[var(--richblack-700)]
        bg-[var(--richblack-800)]
        p-4 sm:p-6
      "
    >
      <p className="text-xl sm:text-2xl font-semibold text-[var(--richblack-5)]">
        Course Builder
      </p>

      {/* FORM */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="flex flex-col gap-2">
          <label
            htmlFor="sectionName"
            className="text-sm text-[var(--richblack-5)]"
          >
            Section Name{" "}
            <sup className="text-[var(--pink-200)]">*</sup>
          </label>

          <input
            id="sectionName"
            disabled={loading}
            placeholder="Add a section to build your course"
            {...register("sectionName", { required: true })}
            className="
              w-full rounded-md px-3 py-2
              bg-[var(--richblack-700)]
              border border-[var(--richblack-600)]
              text-[var(--richblack-5)]
              placeholder:text-[var(--richblack-300)]
              focus:outline-none
              focus:ring-1 focus:ring-[var(--yellow-50)]
            "
          />

          {errors.sectionName && (
            <span className="text-xs text-[var(--pink-200)]">
              Section name is required
            </span>
          )}
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <IconBtn
            type="submit"
            disabled={loading}
            outline
            text={
              editSectionName
                ? "Edit Section Name"
                : "Create Section"
            }
          >
            <IoAddCircleOutline size={20} />
          </IconBtn>

          {editSectionName && (
            <button
              type="button"
              onClick={cancelEdit}
              className="text-sm underline text-[var(--richblack-300)]"
            >
              Cancel Edit
            </button>
          )}
        </div>
      </form>

      {/* SECTIONS */}
      {course?.courseContent?.length > 0 && (
        <NestedView
          handleChangeEditSectionName={handleChangeEditSectionName}
        />
      )}

      {/* FOOTER BUTTONS */}
      <div className="flex flex-col sm:flex-row justify-end gap-3">
        <button
          onClick={goBack}
          className="
            flex items-center justify-center gap-2
            rounded-md
            bg-[var(--richblack-300)]
            px-5 py-2
            font-semibold
            text-[var(--richblack-900)]
          "
        >
          Back
        </button>

        <IconBtn disabled={loading} text="Next" onClick={goNext}>
          <MdNavigateNext />
        </IconBtn>
      </div>
    </div>
  )
}
