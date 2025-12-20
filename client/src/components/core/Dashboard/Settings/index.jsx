import ChangeProfilePicture from "./ChangeProfilePicture"
import DeleteAccount from "./DeleteAccount"
import EditProfile from "./EditProfile"
import UpdatePassword from "./UpdatePassword"

export default function Settings() {
  return (
    <>
      <h1
        className="
          mb-8 sm:mb-10 md:mb-14
          text-2xl sm:text-3xl
          font-medium
          text-[var(--richblack-5)]
        "
      >
        Edit Profile
      </h1>

      {/* Change Profile Picture */}
      <ChangeProfilePicture />

      {/* Profile */}
      <EditProfile />

      {/* Password */}
      <UpdatePassword />

      {/* Delete Account */}
      <DeleteAccount />
    </>
  )
}
