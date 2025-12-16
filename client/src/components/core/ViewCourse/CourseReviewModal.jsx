import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { RxCross2 } from "react-icons/rx"

import { useSelector } from "react-redux"

import StarRating from "../HomePage/common/StarRating"


import { createRating } from "../../../services/operations/courseDetailsAPI"
import IconBtn from "../HomePage/common/IconBtn"

export default function CourseReviewModal({ setReviewModal }) {
  const { user } = useSelector((state) => state.profile)
  const { token } = useSelector((state) => state.auth)
  const { courseEntireData } = useSelector((state) => state.viewCourse)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm()

  //  initialize form values
  useEffect(() => {
    setValue("courseExperience", "")
    setValue("courseRating", 3)

  }, [])

  //  star click handler
  const ratingChanged = (newRating) => {
    setValue("courseRating", newRating)
  }

  // submit handler
const onSubmit = async (data) => {
  if (data.courseRating < 1) {
    toast.error("Please select at least 1 star")
    return
  }

  const success = await createRating(
    {
      courseId: courseEntireData._id,
      rating: data.courseRating,
      review: data.courseExperience,
    },
    token
  )

  if (success) setReviewModal(false)
}



  return (
    <div className="fixed inset-0 z-[1000] grid h-screen w-screen place-items-center bg-white bg-opacity-10 backdrop-blur-sm">
      <div className="w-11/12 max-w-[700px] rounded-lg border border-richblack-400 bg-richblack-800">
        
        {/* HEADER */}
        <div className="flex items-center justify-between rounded-t-lg bg-richblack-700 p-5">
          <p className="text-xl font-semibold text-richblack-5">
            Add Review
          </p>
          <button onClick={() => setReviewModal(false)}>
            <RxCross2 className="text-2xl text-richblack-5" />
          </button>
        </div>

        {/* BODY */}
        <div className="p-6">
          <div className="flex items-center justify-center gap-4">
            <img
              src={user?.image}
              alt="profile"
              className="h-[50px] w-[50px] rounded-full object-cover"
            />
            <div>
              <p className="font-semibold text-richblack-5">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-sm text-richblack-5">
                Posting Publicly
              </p>
            </div>
          </div>

          {/* FORM */}
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="mt-6 flex flex-col items-center gap-6"
          >
            
         <StarRating
  rating={watch("courseRating")}
  setRating={(val) => setValue("courseRating", val)}
/>



            {/* REVIEW TEXT */}
            <div className="flex w-11/12 flex-col gap-2">
              <label className="text-sm text-richblack-5">
                Add Your Experience <sup className="text-pink-200">*</sup>
              </label>

              <textarea
                placeholder="Add your experience..."
                {...register("courseExperience", { required: true })}
                className="form-style min-h-[130px] w-full resize-none"
              />

              {errors.courseExperience && (
                <span className="text-xs text-pink-200">
                  Please add your experience
                </span>
              )}
            </div>

            {/* BUTTONS */}
            <div className="flex w-11/12 justify-end gap-3">
              <button
                type="button"
                onClick={() => setReviewModal(false)}
                className="rounded-md bg-richblack-300 px-5 py-2 font-semibold text-richblack-900"
              >
                Cancel
              </button>

              <IconBtn text="Save" type="submit" />
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
