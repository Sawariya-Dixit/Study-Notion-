import React, { useEffect, useState } from "react"
import logo from "../../../../assets/logo/Logo-Full-Light.png"
import { Link, useLocation, matchPath } from "react-router-dom"
import { NavbarLinks } from "../../../../data/navbar-links"
import { useSelector } from "react-redux"
import { AiOutlineShoppingCart } from "react-icons/ai"
import ProfileDropDown from "../../auth/ProfileDropDown"
import { BsChevronDown } from "react-icons/bs"

// API
import { apiConnector } from "../../../../services/apiconnector"
import { categories } from "../../../../services/operations/apis"

const NavBar = () => {
  const { token } = useSelector((state) => state.auth)
  const { user } = useSelector((state) => state.profile)
  const { totalItems } = useSelector((state) => state.cart)

  const location = useLocation()
  const [subLinks, setSubLinks] = useState([])

  // mobile states
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [mobileCatalogOpen, setMobileCatalogOpen] = useState(false)

  const fetchCategories = async () => {
    try {
      const res = await apiConnector("GET", categories.CATEGORIES_API)
      setSubLinks(res?.data?.data || [])
    } catch (error) {
      console.log("Error fetching categories:", error)
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  const matchRoute = (route) => {
    return matchPath({ path: route }, location.pathname)
  }

  return (
    <div className="relative flex h-16 items-center justify-center border-b border-[var(--richblack-700)] bg-[var(--richblack-900)] px-6">
      <div className="flex w-full max-w-maxContent items-center justify-between gap-6">

        {/* ---------- Logo ---------- */}
        <Link to="/" className="shrink-0">
          <img
            src={logo}
            className="w-[130px] sm:w-[160px]"
            loading="lazy"
            alt="Logo"
          />
        </Link>

        {/* ---------- Desktop Nav (CENTERED) ---------- */}
        <nav className="hidden md:flex flex-1 justify-center">
          <ul className="flex gap-x-8 text-[var(--richblack-25)]">

            {NavbarLinks.map((link, index) => (
              <li key={index} className="relative">

                {/* ===== Catalog (Desktop Hover) ===== */}
                {link.title === "Catalog" ? (
                  <div className="group flex cursor-pointer items-center gap-1">
                    <p>{link.title}</p>
                    <BsChevronDown size={14} />

                    <div className="
                      invisible opacity-0 group-hover:visible group-hover:opacity-100
                      absolute left-1/2 top-full -translate-x-1/2 mt-3
                      z-50 flex flex-col gap-1 w-[260px]
                      rounded-md bg-[var(--richblack-5)] p-4
                      text-[var(--richblack-900)]
                      shadow-md transition-all duration-200
                    ">
                      <div className="absolute left-1/2 top-0 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rotate-45 bg-[var(--richblack-5)]" />

                      {subLinks.length > 0 ? (
                        subLinks.map((cat, i) => {
                          const slug = cat.name.toLowerCase().replace(/ /g, "-")
                          return (
                            <Link
                              key={i}
                              to={`/catalog/${slug}`}
                              className="rounded-md px-3 py-2 hover:bg-[var(--richblack-100)]"
                            >
                              {cat.name}
                            </Link>
                          )
                        })
                      ) : (
                        <p>No Categories Found</p>
                      )}
                    </div>
                  </div>
                ) : (
                  <Link to={link.path}>
                    <p
                      className={
                        matchRoute(link.path)
                          ? "text-[var(--yellow-400)]"
                          : "text-[var(--richblack-25)]"
                      }
                    >
                      {link.title}
                    </p>
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>

        {/* ---------- Right Side ---------- */}
        <div className="flex items-center gap-5 text-[var(--white)]">

          {/* Cart */}
          {user && user.accountType !== "Instructor" && (
            <Link to="/dashboard/cart" className="relative text-xl">
              <AiOutlineShoppingCart />
              {totalItems > 0 && (
                <span className="
                  absolute -top-2 -right-2
                  rounded-full bg-[var(--yellow-400)] text-[var(--black)]
                  px-2 py-[1px] text-xs
                ">
                  {totalItems}
                </span>
              )}
            </Link>
          )}

          {/* Desktop Auth ONLY */}
          {!token && (
            <div className="hidden sm:flex gap-3">
              <Link to="/login">
                <button className="rounded-md border border-[var(--richblack-700)] bg-[var(--richblack-800)] px-4 py-1">
                  Log In
                </button>
              </Link>
              <Link to="/signup">
                <button className="rounded-md border border-[var(--richblack-700)] bg-[var(--richblack-800)] px-4 py-1">
                  Sign Up
                </button>
              </Link>
            </div>
          )}

          {token && <ProfileDropDown />}

          {/* Hamburger */}
          <button
            className="md:hidden text-2xl"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            ☰
          </button>
        </div>
      </div>

      {/* ---------- Mobile Menu (NO Login / Signup) ---------- */}
      {mobileMenuOpen && (
        <div className="absolute top-16 left-0 z-50 w-full bg-[var(--richblack-900)] border-t border-[var(--richblack-700)] md:hidden">
          <ul className="flex flex-col gap-4 p-5 text-[var(--richblack-25)]">

            {NavbarLinks.map((link, i) => (
              <li key={i}>
                {link.title === "Catalog" ? (
                  <>
                    <button
                      onClick={() => setMobileCatalogOpen(!mobileCatalogOpen)}
                      className="flex w-full items-center justify-between"
                    >
                      Catalog <BsChevronDown />
                    </button>

                    {mobileCatalogOpen && (
                      <div className="mt-2 flex flex-col gap-2 pl-4 text-sm">
                        {subLinks.map((cat, j) => {
                          const slug = cat.name.toLowerCase().replace(/ /g, "-")
                          return (
                            <Link
                              key={j}
                              to={`/catalog/${slug}`}
                              onClick={() => setMobileMenuOpen(false)}
                            >
                              {cat.name}
                            </Link>
                          )
                        })}
                      </div>
                    )}
                  </>
                ) : (
                  <Link
                    to={link.path}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {link.title}
                  </Link>
                )}
              </li>
            ))}

          </ul>
        </div>
      )}
    </div>
  )
}

export default NavBar
