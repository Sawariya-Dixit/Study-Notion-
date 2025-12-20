import { useEffect, useState } from "react"
import { useDropzone } from "react-dropzone"
import { FiUploadCloud } from "react-icons/fi"

export default function Upload({
  name,
  label,
  register,
  setValue,
  errors,
  video = false,
  accept = null,
  viewData = null,
  editData = null,
}) {
  const [selectedFile, setSelectedFile] = useState(null)
  const [previewSource, setPreviewSource] = useState("")

  // Prefill for edit/view
  useEffect(() => {
    if (editData) {
      setPreviewSource(editData)
      setValue(name, null)
    } else if (viewData) {
      setPreviewSource(viewData)
    }
  }, [editData, viewData, name, setValue])

  useEffect(() => {
    register(name, { required: !viewData })
  }, [register, name, viewData])

  const onDrop = (acceptedFiles) => {
    const file = acceptedFiles[0]
    if (!file) return
    previewFile(file)
    setSelectedFile(file)
    setValue(name, file)
  }

  const previewFile = (file) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onloadend = () => setPreviewSource(reader.result)
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: accept
      ? accept
      : !video
      ? { "image/*": [".jpeg", ".jpg", ".png"] }
      : { "video/*": [".mp4", ".mov", ".mkv"] },
    onDrop,
    multiple: false,
  })

  const handleCancel = (e) => {
    e.stopPropagation()
    setPreviewSource("")
    setSelectedFile(null)
    setValue(name, null)
  }

  return (
    <div className="flex flex-col space-y-2">
      {/* LABEL */}
      <label
        className="text-sm text-[var(--richblack-5)]"
        htmlFor={name}
      >
        {label} {!viewData && <sup className="text-[var(--pink-200)]">*</sup>}
      </label>

      {/* DROPZONE */}
      <div
        {...getRootProps()}
        className={`
          flex min-h-[250px] cursor-pointer items-center justify-center
          rounded-md border-2 border-dotted
          ${
            isDragActive
              ? "bg-[var(--richblack-600)]"
              : "bg-[var(--richblack-700)]"
          }
          border-[var(--richblack-500)]
        `}
      >
        {previewSource ? (
          <div className="flex w-full flex-col p-6">
            {!video ? (
              <img
                src={previewSource}
                alt="Preview"
                className="h-[300px] w-full rounded-md object-cover"
              />
            ) : (
              <video
                src={previewSource}
                className="w-full max-h-[300px] rounded-md"
                controls
              />
            )}

            {!viewData && (
              <button
                type="button"
                onClick={handleCancel}
                className="mt-3 text-sm text-[var(--richblack-400)] underline"
              >
                Cancel
              </button>
            )}
          </div>
        ) : (
          <div className="flex w-full flex-col items-center p-6">
            <input {...getInputProps()} />

            <div className="grid aspect-square w-14 place-items-center rounded-full bg-[var(--pure-greys-800)]">
              <FiUploadCloud className="text-2xl text-var[(--yellow-50)]" />
            </div>

            <p className="mt-2 max-w-[200px] text-center text-sm text-[var(--richblack-200)]">
              Drag and drop an {!video ? "image" : "video"}, or click to{" "}
              <span className="font-semibold text-var[(--yellow-50)]">Browse</span>
            </p>

            {!video && (
              <ul className="mt-10 flex list-disc justify-between space-x-12 text-center text-xs text-[var(--richblack-200)]">
                <li>Aspect ratio 16:9</li>
                <li>Recommended size 1024×576</li>
              </ul>
            )}
          </div>
        )}
      </div>

      {/* ERROR */}
      {errors[name] && (
        <span className="ml-2 text-xs tracking-wide text-[var(--pink-200)]">
          {label} is required
        </span>
      )}
    </div>
  )
}
