import { useEffect, useRef, useState } from "react"
import { FiUpload } from "react-icons/fi"
import { useDispatch, useSelector } from "react-redux"

import { updateDisplayPicture } from "../../../../services/operations/SettingAPI"
import IconBtn from "../../HomePage/common/IconBtn"

export default function ChangeProfilePicture() {
  const { token } = useSelector((state) => state.auth)
  const { user } = useSelector((state) => state.profile)
  const dispatch = useDispatch()

  const [loading, setLoading] = useState(false)
  const [imageFile, setImageFile] = useState(null)
  const [previewSource, setPreviewSource] = useState(null)

  const fileInputRef = useRef(null)

  const handleClick = () => {
    fileInputRef.current.click()
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setImageFile(file)
      previewFile(file)
    }
  }

  const previewFile = (file) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onloadend = () => {
      setPreviewSource(reader.result)
    }
  }

  const handleFileUpload = () => {
    if (!imageFile) return

    try {
      setLoading(true)
      const formData = new FormData()
      formData.append("displayPicture", imageFile)

      dispatch(updateDisplayPicture(token, formData)).then(() => {
        setLoading(false)
        setPreviewSource(null)
        setImageFile(null)
      })
    } catch (error) {
      console.log("UPLOAD ERROR → ", error.message)
      setLoading(false)
    }
  }

  useEffect(() => {
    if (imageFile) {
      previewFile(imageFile)
    }
  }, [imageFile])

  return (
    <div
      className="
        flex flex-col sm:flex-row sm:items-center sm:justify-between
        gap-4
        rounded-md border
        border-[var(--richblack-700)]
        bg-[var(--richblack-800)]
        p-4 sm:p-6 md:p-8
        text-[var(--richblack-5)]
      "
    >
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <img
          src={previewSource || user?.image}
          alt={`profile-${user?.firstName}`}
          className="
            aspect-square w-[64px] sm:w-[72px] md:w-[78px]
            rounded-full object-cover
            border border-[var(--richblack-700)]
          "
        />

        <div className="space-y-2 text-center sm:text-left">
          <p className="font-semibold">
            Change Profile Picture
          </p>

          <div className="flex flex-col xs:flex-row gap-3">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              accept="image/png, image/gif, image/jpeg"
            />

            <button
              onClick={handleClick}
              disabled={loading}
              className="
                cursor-pointer rounded-md
                bg-[var(--richblack-700)]
                px-5 py-2
                font-semibold
                text-[var(--richblack-50)]
                disabled:opacity-50
              "
            >
              Select
            </button>

            <IconBtn
              text={loading ? "Uploading..." : "Upload"}
              onClick={handleFileUpload}
              disabled={loading || !imageFile}
            >
              {!loading && (
                <FiUpload className="text-lg text-[var(--richblack-900)]" />
              )}
            </IconBtn>
          </div>
        </div>
      </div>
    </div>
  )
}
