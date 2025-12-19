import React, { useEffect, useState } from "react";
import Footer from "../components/core/HomePage/common/Footer";
import { useParams } from "react-router-dom";
import { apiConnector } from "../services/apiConnector";
import { categories } from "../services/operations/apis";
import { getCatalogaPageData } from "../services/operations/pageAndComponentData";
import Course_Card from "../components/core/Catalog/Course_Card";
import CourseSlider from "../components/core/Catalog/CourseSlider";
import { useSelector } from "react-redux";
import Error from "./Error";

const Catalog = () => {
  const { loading } = useSelector((state) => state.profile);
  const { catalogName } = useParams();
  const [active, setActive] = useState(1);
  const [catalogPageData, setCatalogPageData] = useState(null);
  const [categoryId, setCategoryId] = useState("");

  // ================= FETCH CATEGORIES =================
  useEffect(() => {
    const getCategories = async () => {
      const res = await apiConnector("GET", categories.CATEGORIES_API);
      const allCategories = res?.data?.data || [];
      const matched = allCategories.find(
        (ct) => ct.name.split(" ").join("-").toLowerCase() === catalogName
      );
      setCategoryId(matched?._id || "");
    };
    getCategories();
  }, [catalogName]);

  // ================= FETCH CATEGORY DATA =================
  useEffect(() => {
    const getCategoryDetails = async () => {
      try {
        const res = await getCatalogaPageData(categoryId);
        setCatalogPageData(res);
      } catch (error) {
        console.log(error);
      }
    };
    if (categoryId) getCategoryDetails();
  }, [categoryId]);

  // ================= LOADING =================
  if (loading || !catalogPageData) {
    return (
      <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!loading && !catalogPageData.success) {
    return <Error />;
  }

  // ================= UI =================
  return (
    <>
      {/* ================= HERO SECTION ================= */}
      <div className="bg-[var(--richblack-800)] px-4 py-8 sm:py-10">
        <div className="mx-auto flex max-w-maxContent flex-col gap-3">
          <p className="text-xs sm:text-sm text-[var(--richblack-300)]">
            Home / Catalog /{" "}
            <span className="text-[var(--yellow-25)]">
              {catalogPageData?.data?.selectedCategory?.name}
            </span>
          </p>

          <h1 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-[var(--richblack-5)]">
            {catalogPageData?.data?.selectedCategory?.name}
          </h1>

          <p className="text-sm sm:text-base max-w-full sm:max-w-[850px] text-[var(--richblack-200)]">
            {catalogPageData?.data?.selectedCategory?.description}
          </p>
        </div>
      </div>

      {/* ================= SECTION 1 ================= */}
      <div className="mx-auto w-full max-w-maxContent px-4 py-8 sm:py-10">
        <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold text-[var(--richblack-5)]">
          Courses to get you started
        </h2>

        {/* Tabs */}
        <div className="mt-4 flex gap-3 overflow-x-auto border-b border-[var(--richblack-600)] text-xs sm:text-sm">
          <button
            onClick={() => setActive(1)}
            className={`px-3 py-2 whitespace-nowrap ${
              active === 1
                ? "border-b border-[var(--yellow-25)] text-[var(--yellow-25)]"
                : "text-[var(--richblack-50)]"
            }`}
          >
            Most Popular
          </button>

          <button
            onClick={() => setActive(2)}
            className={`px-3 py-2 whitespace-nowrap ${
              active === 2
                ? "border-b border-[var(--yellow-25)] text-[var(--yellow-25)]"
                : "text-[var(--richblack-50)]"
            }`}
          >
            New
          </button>
        </div>

        {/* Slider */}
        <div className="mt-6 w-full">
          <CourseSlider
            Courses={catalogPageData?.data?.selectedCategory?.courses || []}
          />
        </div>
      </div>

      {/* ================= SECTION 2 ================= */}
      <div className="mx-auto w-full max-w-maxContent px-4 py-8 sm:py-10">
        <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold text-[var(--richblack-5)]">
          Top courses in{" "}
          {catalogPageData?.data?.differentCategory?.name || "Other Category"}
        </h2>

        <div className="mt-6">
          <CourseSlider
            Courses={catalogPageData?.data?.differentCategory?.courses || []}
          />
        </div>
      </div>

      {/* ================= SECTION 3 ================= */}
      <div className="mx-auto w-full max-w-maxContent px-4 py-8 sm:py-10">
        <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold text-[var(--richblack-5)]">
          Frequently Bought
        </h2>

        <div className="mt-6 grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2">
          {(catalogPageData?.data?.mostSellingCourses || [])
            .slice(0, 4)
            .map((course, i) => (
              <Course_Card
                key={i}
                course={course}
                Height="h-[340px] sm:h-[380px] lg:h-[400px]"
              />
            ))}
        </div>
      </div>

      {/* ================= FOOTER ================= */}
      <Footer />
    </>
  );
};

export default Catalog;
