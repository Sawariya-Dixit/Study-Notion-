import { FaCheck } from "react-icons/fa"
import { useSelector } from "react-redux"

import CourseBuilderForm from "./CourseBuilder/CourseBuilderForm"
import CourseInformationForm from "./CourseInformation/CourseInformationForm"
import PublishCourse from "./PublishCourse/index"

export default function RenderSteps() {
  const { step } = useSelector((state) => state.course)

  const steps = [
    { id: 1, title: "Course Information" },
    { id: 2, title: "Course Builder" },
    { id: 3, title: "Publish" },
  ]

  return (
    <>
      {/* ===== STEPPER ICONS ===== */}
      <div className="relative mb-2 flex w-full justify-center">
        {steps.map((item, index) => (
          <div key={item.id} className="flex w-full items-center justify-center">
            {/* STEP CIRCLE */}
            <div className="flex flex-col items-center">
              <button
                className={`
                  grid aspect-square w-[34px] place-items-center rounded-full border
                  cursor-default
                  ${
                    step === item.id
                      ? "border-yellow-50 bg-yellow-900 text-yellow-50"
                      : step > item.id
                      ? "border-yellow-50 bg-yellow-50 text-[var(--richblack-900)]"
                      : "border-[var(--richblack-700)] bg-[var(--richblack-800)] text-[var(--richblack-300)]"
                  }
                `}
              >
                {step > item.id ? (
                  <FaCheck className="text-sm font-bold" />
                ) : (
                  item.id
                )}
              </button>
            </div>

            {/* CONNECTING LINE */}
            {index !== steps.length - 1 && (
              <div
                className={`
                  h-[1px]
                  flex-1
                  border-b-2
                  border-dashed
                  mx-2
                  ${
                    step > item.id
                      ? "border-yellow-50"
                      : "border-[var(--richblack-500)]"
                  }
                `}
              />
            )}
          </div>
        ))}
      </div>

      {/* ===== STEP TITLES ===== */}
      <div className="relative mb-16 flex w-full justify-between select-none">
        {steps.map((item) => (
          <div
            key={item.id}
            className="flex min-w-[90px] sm:min-w-[130px] flex-col items-center gap-y-2 text-center"
          >
            <p
              className={`
                text-xs sm:text-sm
                ${
                  step >= item.id
                    ? "text-[var(--richblack-5)]"
                    : "text-[var(--richblack-500)]"
                }
              `}
            >
              {item.title}
            </p>
          </div>
        ))}
      </div>

      {/* ===== STEP CONTENT ===== */}
      {step === 1 && <CourseInformationForm />}
      {step === 2 && <CourseBuilderForm />}
      {step === 3 && <PublishCourse />}
    </>
  )
}
