import { useState } from "react"
import { VscSignOut, VscSettingsGear } from "react-icons/vsc"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"

import { sidebarLinks } from "../../../data/dashboard-links"
import { logout } from "../../../services/operations/authAPI"
import ConfirmationModal from "../HomePage/common/ConfirmationModal"
import SidebarLink from "./Sidebarlink"   

export default function Sidebar({ open, setOpen }) {
  const { user, loading: profileLoading } = useSelector(
    (state) => state.profile
  )
  const { loading: authLoading } = useSelector((state) => state.auth)

  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [confirmationModal, setConfirmationModal] = useState(null)

  if (profileLoading || authLoading) {
    return (
      <div className="grid h-screen w-[220px] place-items-center bg-richblack-800">
        <div className="spinner" />
      </div>
    )
  }

  return (
    <>
      {/* Overlay (Mobile only) */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-30 bg-black/40 lg:hidden"
        />
      )}

      <div
        className={`fixed z-40 h-[calc(100vh-3.5rem)] w-[220px] 
        bg-richblack-800 border-r border-richblack-700 py-10
        transition-transform duration-300
        ${open ? "translate-x-0" : "-translate-x-full"}
        lg:static lg:translate-x-0`}
      >
        {/* LINKS */}
        <div className="flex flex-col">
          {sidebarLinks.map((link) => {
            if (link.type && user?.accountType !== link.type) return null
            return (
              <SidebarLink
                key={link.id}
                link={link}
                iconName={link.icon}
                onClick={() => setOpen(false)}
              />
            )
          })}
        </div>

        <div className="mx-auto my-6 h-px w-10/12 bg-richblack-700" />

        {/* SETTINGS + LOGOUT */}
        <div className="flex flex-col">
          <SidebarLink
            link={{ name: "Settings", path: "/dashboard/settings" }}
            iconName="VscSettingsGear"
            onClick={() => setOpen(false)}
          />

          <button
            onClick={() =>
              setConfirmationModal({
                text1: "Are you sure?",
                text2: "You will be logged out of your account.",
                btn1Text: "Logout",
                btn2Text: "Cancel",
                btn1Handler: () => dispatch(logout(navigate)),
                btn2Handler: () => setConfirmationModal(null),
              })
            }
            className="px-8 py-2 text-sm font-medium text-richblack-300"
          >
            <div className="flex items-center gap-x-2">
              <VscSignOut className="text-lg" />
              <span>Logout</span>
            </div>
          </button>
        </div>
      </div>

      {confirmationModal && (
        <ConfirmationModal modalData={confirmationModal} />
      )}
    </>
  )
}
