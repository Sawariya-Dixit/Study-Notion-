import { toast } from "react-hot-toast"
import { apiConnector } from "../apiConnector"
import { courseEndpoints } from "./apis"

const {
  COURSE_DETAILS_API,
  COURSE_CATEGORIES_API,
  GET_ALL_COURSE_API,
  CREATE_COURSE_API,
  EDIT_COURSE_API,
  CREATE_SECTION_API,
  CREATE_SUBSECTION_API,
  UPDATE_SECTION_API,
  UPDATE_SUBSECTION_API,
  DELETE_SECTION_API,
  DELETE_SUBSECTION_API,
  GET_ALL_INSTRUCTOR_COURSES_API,
  DELETE_COURSE_API,
  GET_FULL_COURSE_DETAILS_AUTHENTICATED,
  CREATE_RATING_API,
  LECTURE_COMPLETION_API,
  ENROLL_COURSE_API
} = courseEndpoints;


// =====================================================================
// GET ALL COURSES
// =====================================================================
export const getAllCourses = async () => {
  const toastId = toast.loading("Loading...");
  let result = [];
  try {
    const response = await apiConnector("GET", GET_ALL_COURSE_API);

    if (!response?.data?.success)
      throw new Error("Could Not Fetch Courses");

    result = response.data.data;
  } catch (error) {
    toast.error(error.message);
  }
  toast.dismiss(toastId);
  return result;
};


// ====================================================================
// GET COURSE DETAILS (without auth)
// =================================.l====================================
export const fetchCourseDetails = async (courseId) => {
  try {
    const response = await apiConnector(
      "POST",
      COURSE_DETAILS_API,
      { courseId }
    );

    // Correct check
    if (!response?.data?.success || !response?.data?.data) {
      console.error("Course details not found", response);
      return { success: false };
    }

    return response.data; // success, data, totalDuration
  } catch (error) {
    console.error("Error fetching course details", error);
    return { success: false };
  }
};




// =====================================================================
// GET COURSE CATEGORIES
// =====================================================================
export const fetchCourseCategories = async () => {
  let result = [];
  try {
    const response = await apiConnector("GET", COURSE_CATEGORIES_API);

    if (!response?.data?.success)
      throw new Error("Could Not Fetch Course Categories");

    result = response.data.data;
  } catch (error) {
    toast.error(error.message);
  }
  return result;
};


// =====================================================================
// CREATE COURSE (multipart)
// =====================================================================
export const addCourseDetails = async (formData, token) => {
  const toastId = toast.loading("Loading...");
  let result = null;

  try {
    const response = await apiConnector(
      "POST",
      CREATE_COURSE_API,
      formData,
      { Authorization: `Bearer ${token}` }
    );

    if (!response?.data?.success)
      throw new Error(response.data.message);

    toast.success("Course Created Successfully");
    result = response.data.data;
  } catch (error) {
    toast.error(error.message);
  }

  toast.dismiss(toastId);
  return result;
};


// =====================================================================
// EDIT COURSE
// =====================================================================
export const editCourseDetails = async (data, token) => {
  console.log("EDIT COURSE DETAILS DATA:", data);
  console.log("EDIT COURSE DETAILS TOKEN:", token);
  const toastId = toast.loading("Loading...");
  let result = null;

  try {
    const response = await apiConnector(
      "PUT",
      EDIT_COURSE_API,
      data,
      { Authorization: `Bearer ${token}` }
    );

    if (!response?.data?.success)
      throw new Error("Could Not Update Course Details");

    toast.success("Course Updated Successfully");
    result = response.data.data;
  } catch (error) {
    toast.error(error.message);
  }

  toast.dismiss(toastId);
  return result;
};


// =====================================================================
// CREATE SECTION
// =====================================================================
export const createSection = async (data, token) => {
  const toastId = toast.loading("Loading...");
  let result = null;

  try {
    const response = await apiConnector(
      "POST",
      CREATE_SECTION_API,
      data,
      { Authorization: `Bearer ${token}` }
    );

    if (!response?.data?.success)
      throw new Error("Could Not Create Section");

    toast.success("Section Created");
    result = response.data.data;
  } catch (error) {
    toast.error(error.message);
  }

  toast.dismiss(toastId);
  return result;
};


// =====================================================================
// CREATE SUBSECTION (multipart)
// =====================================================================
export const createSubSection = async (formData, token) => {
  const toastId = toast.loading("Uploading lecture...");
  let result = null;

  try {
    console.log("CREATE SUBSECTION REQUEST FORM DATA:");
    for (let pair of formData.entries()) {
      console.log(pair[0], pair[1]);
    }

    const response = await apiConnector(
      "POST",
      CREATE_SUBSECTION_API,
      formData,
      { Authorization: `Bearer ${token}` }
    );

    console.log("CREATE SUBSECTION RESPONSE:", response);

    if (!response?.data?.success)
      throw new Error("Could Not Add Lecture");

    toast.success("Lecture Added");
    result = response.data.data;
  } catch (error) {
    console.error("CREATE SUBSECTION ERROR:", error);
    toast.error(error.message);
  }

  toast.dismiss(toastId);
  return result;
};


// =====================================================================
// UPDATE SECTION
// =====================================================================
export const updateSection = async (data, token) => {
  const toastId = toast.loading("Loading...");
  let result = null;

  try {
    const response = await apiConnector(
      "PUT",
      UPDATE_SECTION_API,
      data,
      { Authorization: `Bearer ${token}` }
    );

    if (!response?.data?.success)
      throw new Error("Could Not Update Section");

    toast.success("Section Updated");
    result = response.data.data;
  } catch (error) {
    toast.error(error.message);
  }

  toast.dismiss(toastId);
  return result;
};


// =====================================================================
// UPDATE SUBSECTION (multipart)
// =====================================================================
export const updateSubSection = async (formData, token) => {
  for (let [key, val] of formData.entries()) {
    console.log(key, val);
  }

  const toastId = toast.loading("Updating lecture...");
  let result = null;

  try {
    const response = await apiConnector(
      "PUT",
      UPDATE_SUBSECTION_API,
      formData,
      { Authorization: `Bearer ${token}` }
    );

    if (!response?.data?.success)
      throw new Error("Could Not Update Lecture");

    toast.success("Lecture Updated");

    console.log("UPDATE RESPONSE:", response.data);

    // ⬅️ FIX: return FULL API RESPONSE, not only data.data
    result = response.data;  
  } catch (error) {
    toast.error(error.message);
  }

  toast.dismiss(toastId);
  return result;
};



// =====================================================================
// DELETE SECTION
// =====================================================================
// courseDetailsAPI.jsx


export const deleteSection = async (data, token) => {
  const toastId = toast.loading("Deleting Section...");
  let result = null;

  try {
    const response = await apiConnector(
      "POST", // POST is safer than DELETE with body
      DELETE_SECTION_API,
      data,
      { Authorization: `Bearer ${token}` }
    );

    if (response?.data?.success) {
      toast.success("Section Deleted Successfully");
      result = response.data.data; // Updated course data
    } else {
      // backend sent success:false
      const message = response?.data?.message || "Could not delete section";
      toast.error(message);
    }
  } catch (error) {
    console.error("Delete Section Error:", error);
    toast.error(error.message || "Something went wrong");
  } finally {
    toast.dismiss(toastId);
  }

  return result;
};



// =====================================================================
// DELETE SUBSECTION
// =====================================================================
export const deleteSubSection = async (data, token) => {
  const toastId = toast.loading("Deleting...");
  let result = null;

  try {
    const response = await apiConnector(
      "DELETE",
      DELETE_SUBSECTION_API,
      data,
      { Authorization: `Bearer ${token}` }
    );

    if (!response?.data?.success)
      throw new Error("Could Not Delete Lecture");

    toast.success("Lecture Deleted");
    result = response.data.data;
  } catch (error) {
    toast.error(error.message);
  }

  toast.dismiss(toastId);
  return result;
};


// =====================================================================
// GET COURSES OF SPECIFIC INSTRUCTOR
// =====================================================================
export const fetchInstructorCourses = async (token) => {
  const toastId = toast.loading("Loading...");
  let result = [];

  try {
    const response = await apiConnector(
      "GET",
      GET_ALL_INSTRUCTOR_COURSES_API,
      null,
      { Authorization: `Bearer ${token}` }
    );

    if (!response?.data?.success)
      throw new Error("Could Not Fetch Instructor Courses");

    result = response.data.data;
  } catch (error) {
    toast.error(error.message);
  }

  toast.dismiss(toastId);
  return result;
};


// =====================================================================
// DELETE COURSE
// =====================================================================
export const deleteCourse = async (data, token) => {
  const toastId = toast.loading("Deleting...");

  try {
    const response = await apiConnector(
      "DELETE",
      DELETE_COURSE_API,
      data,
      { Authorization: `Bearer ${token}` }
    );

    if (!response?.data?.success)
      throw new Error("Could Not Delete Course");

    toast.success("Course Deleted");
  } catch (error) {
    toast.error(error.message);
  }

  toast.dismiss(toastId);
};


// =====================================================================
// GET FULL COURSE DETAILS (AUTH REQUIRED)
// =====================================================================


export const getFullDetailsOfCourse = async (courseId, token) => {
  const toastId = toast.loading("Loading course details...");
  let result = null;

  try {
    const response = await apiConnector(
      "POST",
      GET_FULL_COURSE_DETAILS_AUTHENTICATED,
      { courseId },
      { Authorization: `Bearer ${token}` }
    );

    if (!response.data.success) {
      // Show toast error to the user
      toast.error(response.data.message);
      // Return the message so frontend can handle it
      return { success: false, message: response.data.message };
    }

    result = response.data.data;

  } catch (error) {
    console.log("API ERROR:", error);
    toast.error("Something went wrong while fetching course details");
    result = { success: false, message: error?.message || "Unknown error" };
  } finally {
    toast.dismiss(toastId);
  }

  return result;
};




// =====================================================================
// MARK LECTURE COMPLETE
// =====================================================================
export const markLectureAsComplete = async (data, token) => {
  console.log("MARK LECTURE COMPLETE DATA:", data);
  console.log("MARK LECTURE COMPLETE TOKEN:", token);
  const toastId = toast.loading("Loading...");
  let result = false;

  try {
    const response = await apiConnector(
      "POST",
      LECTURE_COMPLETION_API,
      data,
      { Authorization: `Bearer ${token}` }
    );

    if (!response?.data?.message)
      throw new Error("Could Not Complete Lecture");

    toast.success("Lecture Completed");
    result = true;
  } catch (error) {
    toast.error(error.message);
  }

  toast.dismiss(toastId);
  return result;
};


// =====================================================================
// CREATE RATING
// =====================================================================
export const createRating = async (data, token) => {
  const toastId = toast.loading("Loading...");
  let success = false;

  try {
    const response = await apiConnector(
      "POST",
      CREATE_RATING_API,
      data,
      { Authorization: `Bearer ${token}` }
    );

    if (!response?.data?.success)
      throw new Error("Could Not Create Rating");

    toast.success("Rating Submitted");
    success = true;
  } catch (error) {
    toast.error(
    error?.response?.data?.message || error.message
  )
  }

  toast.dismiss(toastId);
  return success;
};



// without payment integration 

export const enrollCourseWithoutPayment = async (
  courseId,
  token,
  navigate
) => {
  const toastId = toast.loading("Enrolling...")
  try {
    const response = await apiConnector(
      "POST",
      ENROLL_COURSE_API,
      { courseId },
      {
        Authorization: `Bearer ${token}`,
      }
    )

    if (!response?.data?.success) {
      throw new Error(response?.data?.message)
    }

    toast.success("Enrolled Successfully 🎉")
    navigate("/dashboard/enrolled-courses")
  } catch (error) {
    console.log("ENROLL ERROR:", error)
    toast.error(error.message || "Enrollment failed")
  }
  toast.dismiss(toastId)
}
