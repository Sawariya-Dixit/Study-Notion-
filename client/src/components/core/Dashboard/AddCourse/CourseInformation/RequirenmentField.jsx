import { useEffect, useState } from "react"
import { useSelector } from "react-redux"

export default function RequirementsField({
  name,
  label,
  register,
  setValue,
  errors,
  getValues,
}) {
  const { editCourse, course } = useSelector((state) => state.course)

  const [requirement, setRequirement] = useState("")
  const [requirementsList, setRequirementsList] = useState([])

  useEffect(() => {
    if (editCourse) {
      setRequirementsList(course?.instructions || [])
    }

    register(name, {
      required: true,
      validate: (value) => value.length > 0,
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    setValue(name, requirementsList)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [requirementsList])

  const handleAddRequirement = () => {
    if (requirement.trim()) {
      setRequirementsList([...requirementsList, requirement.trim()])
      setRequirement("")
    }
  }

  const handleRemoveRequirement = (index) => {
    const updated = [...requirementsList]
    updated.splice(index, 1)
    setRequirementsList(updated)
  }

  return (
    <div className="flex flex-col space-y-2">
      {/* LABEL */}
      <label
        htmlFor={name}
        className="text-sm text-[var(--richblack-5)]"
      >
        {label} <sup className="text-[var(--pink-200)]">*</sup>
      </label>

      {/* INPUT + ADD */}
      <div className="flex flex-col items-start gap-2">
        <input
          type="text"
          id={name}
          value={requirement}
          onChange={(e) => setRequirement(e.target.value)}
          className="form-style w-full"
          placeholder="Enter requirement"
        />

        <button
          type="button"
          onClick={handleAddRequirement}
          className="
            font-semibold
            text-[var(--yellow-50)]
            hover:text-[var(--yellow-100)]
          "
        >
          Add
        </button>
      </div>

      {/* REQUIREMENTS LIST */}
      {requirementsList.length > 0 && (
        <ul className="mt-2 list-inside list-disc space-y-1">
          {requirementsList.map((item, index) => (
            <li
              key={index}
              className="flex items-center gap-2 text-[var(--richblack-5)]"
            >
              <span>{item}</span>
              <button
                type="button"
                onClick={() => handleRemoveRequirement(index)}
                className="
                  text-xs
                  text-[var(--pure-greys-300)]
                  hover:text-[var(--pink-200)]
                "
              >
                clear
              </button>
            </li>
          ))}
        </ul>
      )}

      {/* ERROR */}
      {errors[name] && (
        <span className="ml-2 text-xs tracking-wide text-[var(--pink-200)]">
          {label} is required
        </span>
      )}
    </div>
  )
}
