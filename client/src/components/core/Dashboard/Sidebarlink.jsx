import * as Icons from "react-icons/vsc"
import { useDispatch } from "react-redux"
import { NavLink, matchPath, useLocation } from "react-router-dom"

import { resetCourseState } from "../../../slices/courseSlice"

export default function SidebarLink({ link, iconName, onClick }) {
  const Icon = Icons[iconName]
  const location = useLocation()
  const dispatch = useDispatch()

  const matchRoute = (route) =>
    matchPath({ path: route }, location.pathname)

  return (
    <NavLink
      to={link.path}
      onClick={() => {
        dispatch(resetCourseState())
        onClick?.()
      }}
      className={`relative px-4 md:px-8 py-2 text-sm font-medium
        ${
          matchRoute(link.path)
            ? "bg-yellow-800 text-yellow-50"
            : "text-richblack-300 hover:bg-richblack-700"
        }`}
    >
      <span
        className={`absolute left-0 top-0 h-full w-[0.15rem] bg-yellow-50
        ${matchRoute(link.path) ? "opacity-100" : "opacity-0"}`}
      />
      <div className="flex items-center gap-x-2">
        <Icon className="text-lg" />
        <span className="block">{link.name}</span>
      </div>
    </NavLink>
  )
}

