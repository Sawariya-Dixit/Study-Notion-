import * as Icons from "react-icons/vsc"
import { NavLink, matchPath, useLocation } from "react-router-dom"

export default function SidebarLink({ link, iconName, onClick }) {
  const Icon = Icons[iconName]
  const location = useLocation()

  const matchRoute = (route) =>
    matchPath({ path: route }, location.pathname)

  return (
    <NavLink
      to={link.path}
      onClick={onClick}
      className={`relative px-8 py-2 text-sm font-medium ${
        matchRoute(link.path)
          ? "bg-yellow-800 text-yellow-50"
          : "text-richblack-300"
      }`}
    >
      <div className="flex items-center gap-2">
        {Icon && <Icon className="text-lg" />}
        <span>{link.name}</span>
      </div>
    </NavLink>
  )
}
