import { toast } from "react-hot-toast";
import { setLoading, setUser } from "../../slices/profileSlice";
import { apiConnector } from "../apiConnector";
import { profileEndpoints } from "../operations/apis";
import { logout } from "./authAPI";

const {
  GET_USER_DETAILS_API,
  GET_USER_ENROLLED_COURSES_API,
  GET_INSTRUCTOR_DATA_API
} = profileEndpoints;


// ----------------------------------------
// 1) GET USER DETAILS
// ----------------------------------------
export function getUserDetails(token, navigate) {
  return async (dispatch) => {
    const toastId = toast.loading("Loading...");
    dispatch(setLoading(true));

    try {

      if (!token) {
        console.log("NO TOKEN FOUND");
        dispatch(logout(navigate));
        return;
      }

      const response = await apiConnector(
        "GET",
        GET_USER_DETAILS_API,
        null,
        { Authorization: `Bearer ${token}` }
      );

      console.log("GET_USER_DETAILS RESPONSE:", response);

      if (!response?.data?.success) {
        throw new Error(response.data.message);
      }

      const data = response.data.data;

      const userImage =
        data?.image ??
        `https://api.dicebear.com/5.x/initials/svg?seed=${data.firstName} ${data.lastName}`;

      dispatch(setUser({ ...data, image: userImage }));
    } catch (error) {
      console.log("GET_USER_DETAILS ERROR:", error);
      toast.error("Could Not Get User Details");
      dispatch(logout(navigate));
    }

    toast.dismiss(toastId);
    dispatch(setLoading(false));
  };
}



// ----------------------------------------
// 2) GET USER ENROLLED COURSES
// ----------------------------------------
export async function getUserEnrolledCourses(token) {
  const toastId = toast.loading("Loading...");
  let result = [];

  try {
    const response = await apiConnector(
      "GET",
      GET_USER_ENROLLED_COURSES_API,
      null,
      { Authorization: `Bearer ${token}` }
    );

    if (!response?.data?.success) {
      throw new Error(response.data.message);
    }

    result = response.data.data;
  } catch (error) {
    console.log("GET_ENROLLED_COURSES ERROR:", error);
    toast.error("Could Not Get Enrolled Courses");
  }

  toast.dismiss(toastId);
  return result;
}



// ----------------------------------------
// 3) GET INSTRUCTOR DATA
// ----------------------------------------
export async function getInstructorData(token) {
  const toastId = toast.loading("Loading...");
  let result = [];

  try {
    const response = await apiConnector(
      "GET",
      GET_INSTRUCTOR_DATA_API,
      null,
      { Authorization: `Bearer ${token}` }
    );

    console.log("GET_INSTRUCTOR_DATA RESPONSE:", response);
    result = response?.data?.courses ?? [];
  } catch (error) {
    console.log("GET_INSTRUCTOR_DATA ERROR:", error);
    toast.error("Could Not Get Instructor Data");
  }

  toast.dismiss(toastId);
  return result;
}
