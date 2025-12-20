import { FiTrash2 } from "react-icons/fi"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"

import { deleteProfile } from "../../../../services/operations/SettingAPI"

export default function DeleteAccount() {
  const { token } = useSelector((state) => state.auth)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  async function handleDeleteAccount() {
    try {
      dispatch(deleteProfile(token, navigate))
    } catch (error) {
      console.log("ERROR MESSAGE - ", error.message)
    }
  }

  return (
    <div
      className="
        my-10
        flex flex-col sm:flex-row
        gap-5
        rounded-md border
        border-[var(--pink-700)]
        bg-[var(--pink-900)]
        p-4 sm:p-6 md:p-8
      "
    >
      {/* ICON */}
      <div
        className="
          flex h-14 w-14
          shrink-0
          items-center justify-center
          rounded-full
          bg-[var(--pink-700)]
        "
      >
        <FiTrash2 className="text-3xl text-[var(--pink-200)]" />
      </div>

      {/* CONTENT */}
      <div className="flex flex-col space-y-2">
        <h2 className="text-lg font-semibold text-[var(--richblack-5)]">
          Delete Account
        </h2>

        <div
          className="
            text-sm
            text-[var(--pink-25)]
            max-w-full sm:max-w-[60%]
          "
        >
          <p>Would you like to delete account?</p>
          <p>
            This account may contain Paid Courses. Deleting your account is
            permanent and will remove all the content associated with it.
          </p>
        </div>

        <button
          type="button"
          onClick={handleDeleteAccount}
          className="
            w-fit
            italic
            text-[var(--pink-300)]
            hover:underline
            transition
          "
        >
          I want to delete my account.
        </button>
      </div>
    </div>
  )
}
