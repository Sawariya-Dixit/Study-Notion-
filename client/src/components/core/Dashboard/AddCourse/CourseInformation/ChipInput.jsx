import { useEffect, useState } from "react"
import { MdClose } from "react-icons/md"
import { useSelector } from "react-redux"

export default function ChipInput({
  label,
  name,
  placeholder,
  register,
  errors,
  setValue,
  getValues,
}) {
  const { editCourse, course } = useSelector((state) => state.course)

  const [chips, setChips] = useState([])

  useEffect(() => {
    if (editCourse) {
      setChips(course?.tag || [])
    }

    register(name, {
      required: true,
      validate: (value) => value.length > 0,
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    setValue(name, chips)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chips])

  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault()
      const value = e.target.value.trim()

      if (value && !chips.includes(value)) {
        setChips([...chips, value])
        e.target.value = ""
      }
    }
  }

  const handleDeleteChip = (index) => {
    setChips(chips.filter((_, i) => i !== index))
  }

  return (
    <div className="flex flex-col gap-2">
      {/* LABEL */}
      <label
        htmlFor={name}
        className="text-sm text-[var(--richblack-5)]"
      >
        {label} <sup className="text-[var(--pink-200)]">*</sup>
      </label>

      {/* CHIPS + INPUT */}
      <div
        className="
          flex w-full flex-wrap items-center gap-2
          rounded-md
          bg-[var(--richblack-800)]
          border border-[var(--richblack-600)]
          p-2
        "
      >
        {chips.map((chip, index) => (
          <div
            key={index}
            className="
              flex items-center gap-1
              rounded-full
              bg-[var(--yellow-400)]
              px-3 py-1
              text-sm
              text-[var(--richblack-900)]
            "
          >
            <span>{chip}</span>
            <button
              type="button"
              onClick={() => handleDeleteChip(index)}
              className="focus:outline-none"
            >
              <MdClose className="text-sm" />
            </button>
          </div>
        ))}

        <input
          id={name}
          name={name}
          type="text"
          placeholder={placeholder}
          onKeyDown={handleKeyDown}
          className="
            flex-1 min-w-[150px]
            bg-transparent
            px-2 py-1
            text-[var(--richblack-5)]
            placeholder:text-[var(--richblack-300)]
            focus:outline-none
          "
        />
      </div>

      {/* ERROR */}
      {errors[name] && (
        <span className="ml-1 text-xs text-[var(--pink-200)]">
          {label} is required
        </span>
      )}
    </div>
  )
}
