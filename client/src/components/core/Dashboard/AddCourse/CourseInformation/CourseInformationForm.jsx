import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { HiOutlineCurrencyRupee } from "react-icons/hi";
import { MdNavigateNext } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";

import {
  addCourseDetails,
  editCourseDetails,
  fetchCourseCategories,
} from "../../../../../services/operations/courseDetailsAPI";
import { setCourse, setStep } from "../../../../../slices/courseSlice";
import { COURSE_STATUS } from "../../../../../utils/constants";
import IconBtn from "../../../HomePage/common/IconBtn";
import Upload from "../Upload";
import ChipInput from "./ChipInput";
import RequirementsField from "./RequirenmentField";

export default function CourseInformationForm() {
  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
  } = useForm();

  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);
  const { course, editCourse } = useSelector((state) => state.course);

  const [loading, setLoading] = useState(false);
  const [courseCategories, setCourseCategories] = useState([]);

  useEffect(() => {
    const loadCategories = async () => {
      setLoading(true);
      const categories = await fetchCourseCategories();
      if (categories.length > 0) setCourseCategories(categories);
      setLoading(false);
    };

    if (editCourse) {
      setValue("courseTitle", course.courseName);
      setValue("courseShortDesc", course.courseDescription);
      setValue("coursePrice", course.price);
      setValue("courseTags", course.tag);
      setValue("courseBenefits", course.whatYouWillLearn);
      setValue("courseCategory", course.category._id);
      setValue("courseRequirements", course.instructions);
      setValue("thumbnail", course.thumbnail);
    }

    loadCategories();
    // eslint-disable-next-line
  }, []);

  //  FIXED VERSION
  const isFormUpdated = () => {
    const currentValues = getValues();

    if (
      currentValues.courseTitle !== course.courseName ||
      currentValues.courseShortDesc !== course.courseDescription ||
      currentValues.coursePrice !== course.price ||
      (currentValues.courseTags || []).toString() !==
        (course?.tag || []).toString() ||
      currentValues.courseBenefits !== course.whatYouWillLearn ||
      currentValues.courseCategory !== course.category._id ||
      (currentValues.courseRequirements || []).toString() !==
        (course?.instructions || []).toString() ||
      currentValues.thumbnail instanceof File
    ) {
      return true;
    }

    return false;
  };

  const onSubmit = async (data) => {
    console.log("SUBMITTED DATA =", data);

    // ================== EDIT MODE ==================
    if (editCourse) {
      if (!isFormUpdated()) {
        toast.error("No changes made to the form");
        return;
      }

      const currentValues = getValues();
      const formData = new FormData();
      formData.append("courseId", course._id);

      if (currentValues.courseTitle !== course.courseName)
        formData.append("courseName", data.courseTitle);

      if (currentValues.courseShortDesc !== course.courseDescription)
        formData.append("courseDescription", data.courseShortDesc);

      if (currentValues.coursePrice !== course.price)
        formData.append("price", data.coursePrice);

      if (
        (currentValues.courseTags || []).toString() !==
        (course?.tag || []).toString()
      )
        formData.append("tag", JSON.stringify(data.courseTags));

      if (currentValues.courseBenefits !== course.whatYouWillLearn)
        formData.append("whatYouWillLearn", data.courseBenefits);

      if (currentValues.courseCategory !== course.category._id)
        formData.append("category", data.courseCategory);

      if (
        (currentValues.courseRequirements || []).toString() !==
        (course?.instructions || []).toString()
      )
        formData.append(
          "instructions",
          JSON.stringify(data.courseRequirements)
        );

      if (currentValues.thumbnail instanceof File)
        formData.append("thumbnailImage", data.thumbnail);

      try {
        setLoading(true);
        const result = await editCourseDetails(formData, token);
        setLoading(false);

        if (result) {
          dispatch(setStep(2));
          dispatch(setCourse(result));
          toast.success("Course updated successfully");
        }
      } catch (err) {
        console.log("EDIT ERROR:", err);
        toast.error("Failed to update course");
        setLoading(false);
      }

      return;
    }

    // ================== CREATE MODE ==================
    const formData = new FormData();
    formData.append("courseName", data.courseTitle);
    formData.append("courseDescription", data.courseShortDesc);
    formData.append("price", data.coursePrice);
    formData.append("tags", JSON.stringify(data.courseTags));
    formData.append("whatYouWillLearn", data.courseBenefits);
    formData.append("category", data.courseCategory);
    formData.append("status", COURSE_STATUS.DRAFT);
    formData.append("instructions", JSON.stringify(data.courseRequirements));
    formData.append("thumbnail", data.thumbnail);

    try {
      setLoading(true);
      const result = await addCourseDetails(formData, token);
      setLoading(false);

      if (result) {
        dispatch(setStep(2));
        dispatch(setCourse(result));
        toast.success("Course created successfully");
      }
    } catch (err) {
      console.log("CREATE ERROR:", err);
      toast.error("Failed to create course");
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-8 rounded-md border border-richblack-700 bg-richblack-800 p-6"
    >
      {/* TITLE */}
      <div className="flex flex-col space-y-2">
        <label className="text-sm text-richblack-5">Course Title *</label>
        <input
          placeholder="Enter Course Title"
          {...register("courseTitle", { required: true })}
          className="form-style"
        />
        {errors.courseTitle && (
          <span className="text-xs text-pink-200">Course title is required</span>
        )}
      </div>

      {/* DESCRIPTION */}
      <div className="flex flex-col space-y-2">
        <label className="text-sm text-richblack-5">
          Course Short Description *
        </label>
        <textarea
          placeholder="Enter description"
          {...register("courseShortDesc", { required: true })}
          className="form-style min-h-[130px]"
        />
        {errors.courseShortDesc && (
          <span className="text-xs text-pink-200">
            Course Description is required
          </span>
        )}
      </div>

      {/* PRICE */}
      <div className="flex flex-col space-y-2">
        <label className="text-sm text-richblack-5">Course Price *</label>
        <div className="relative">
          <input
            placeholder="Enter price"
            {...register("coursePrice", { required: true, valueAsNumber: true })}
            className="form-style pl-12!"
          />
          <HiOutlineCurrencyRupee className="absolute left-3 top-1/2 -translate-y-1/2 text-2xl text-richblack-400" />
        </div>
      </div>

      {/* CATEGORY */}
      <div className="flex flex-col space-y-2">
        <label className="text-sm text-richblack-5">Course Category *</label>
        <select
          {...register("courseCategory", { required: true })}
          defaultValue=""
          className="form-style"
        >
          <option value="" disabled>
            Choose a category
          </option>
          {!loading &&
            courseCategories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
        </select>
      </div>

      {/* TAGS */}
      <ChipInput
        label="Tags"
        name="courseTags"
        placeholder="Enter tags and press Enter"
        register={register}
        errors={errors}
        setValue={setValue}
        getValues={getValues}
      />

      {/* THUMBNAIL */}
      <Upload
        name="thumbnail"
        label="Course Thumbnail"
        register={register}
        setValue={setValue}
        errors={errors}
        accept={{ "image/*": [".jpeg", ".jpg", ".png"] }}
        editData={editCourse ? course?.thumbnail : null}
      />

      {/* BENEFITS */}
      <div className="flex flex-col space-y-2">
        <label className="text-sm text-richblack-5">
          Benefits of the Course *
        </label>
        <textarea
          {...register("courseBenefits", { required: true })}
          className="form-style min-h-[130px]"
          placeholder="Enter benefits"
        />
      </div>

      {/* REQUIREMENTS */}
      <RequirementsField
        name="courseRequirements"
        label="Requirements / Instructions"
        register={register}
        setValue={setValue}
        errors={errors}
        getValues={getValues}
      />

      {/* BUTTONS */}
      <div className="flex justify-end gap-2">
        {editCourse && (
          <button
            type="button"
            onClick={() => dispatch(setStep(2))}
            className="rounded-md bg-richblack-300 px-4 py-2 font-semibold text-richblack-900"
          >
            Continue Without Saving
          </button>
        )}

       <IconBtn type="submit" disabled={loading} text={editCourse ? "Save Changes" : "Next"}>
  <MdNavigateNext />
</IconBtn>

      </div>
    </form>
  );
}
