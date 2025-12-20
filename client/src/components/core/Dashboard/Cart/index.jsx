import { useSelector } from "react-redux"

import RenderCartCourses from "./RenderCartCourses"
import RenderTotalAmount from "./RenderTotalAmount"

export default function Cart() {
  const { total, totalItems } = useSelector((state) => state.cart)

  return (
    <>
      {/* HEADING */}
      <h1 className="mb-14 text-3xl font-medium text-[var(--richblack-5)]">
        Cart
      </h1>

      {/* SUBTEXT */}
      <p className="border-b border-b-[var(--richblack-400)] pb-2 font-semibold text-[var(--richblack-400)]">
        {totalItems} Courses in Cart
      </p>

      {/* CONTENT */}
      {total > 0 ? (
        <div className="mt-8 flex flex-col-reverse items-start gap-x-10 gap-y-6 lg:flex-row">
          <RenderCartCourses />
          <RenderTotalAmount />
        </div>
      ) : (
        <p className="mt-14 text-center text-3xl text-[var(--richblack-100)]">
          Your cart is empty
        </p>
      )}
    </>
  )
}
