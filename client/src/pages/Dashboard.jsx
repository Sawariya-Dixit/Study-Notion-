import { useState } from "react"
import { useSelector } from "react-redux"
import { Outlet } from "react-router-dom"
import { HiMenu } from "react-icons/hi"

import Sidebar from "../components/core/Dashboard/Sidebar"

function Dashboard() {
  const { loading: profileLoading } = useSelector((state) => state.profile)
  const { loading: authLoading } = useSelector((state) => state.auth)

  const [openSidebar, setOpenSidebar] = useState(false)

  if (profileLoading || authLoading) {
    return (
      <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
        <div className="spinner"></div>
      </div>
    )
  }

  return (
    <div className="relative flex min-h-[calc(100vh-3.5rem)]">
      {/* Sidebar */}
      <Sidebar open={openSidebar} setOpen={setOpenSidebar} />

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {/* Mobile Header */}
        <div className="sticky top-0 z-20 flex items-center gap-3 bg-richblack-900 px-4 py-3 lg:hidden">
          <button onClick={() => setOpenSidebar(true)}>
            <HiMenu className="text-2xl text-richblack-5" />
          </button>
          <p className="text-lg font-semibold text-richblack-5">
            Dashboard
          </p>
        </div>

        <div className="mx-auto w-11/12 max-w-[1000px] py-6 lg:py-10">
          <Outlet />
        </div>
      </div>
    </div>
  )
}

export default Dashboard
