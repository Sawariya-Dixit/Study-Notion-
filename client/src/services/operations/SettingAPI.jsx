import { toast } from "react-hot-toast";
import { setUser } from "../../slices/profileSlice";
import { apiConnector } from "../apiconnector";
import { settingsEndpoints } from "./apis";

const { UPDATE_DISPLAY_PICTURE_API, UPDATE_PROFILE_API , CHANGE_PASSWORD_API,DELETE_PROFILE_API} = settingsEndpoints;

// Update Profile Picture
export function updateDisplayPicture(token, formData) {
  console.log("updated",token)
  console.log("updated", formData);
  return async (dispatch) => {
    const toastId = toast.loading("Uploading...");
    try {
      const response = await apiConnector(
        "PUT",
        UPDATE_DISPLAY_PICTURE_API,
        formData,
        {
          // "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        }
      );
if (!response.data.success) throw new Error(response.data.message);

const updatedUser = response.data.data;

dispatch(setUser(updatedUser));
localStorage.setItem("user", JSON.stringify(updatedUser));

toast.success("Display Picture Updated Successfully");

    } catch (error) {
      console.log("UPDATE DP ERROR → ", error);
      toast.error("Could Not Update Display Picture");
    }
    toast.dismiss(toastId);
  };
}

// Update Profile Info
// Update Profile Info
export function updateProfile(token, formData) {

  return async (dispatch) => {
    const toastId = toast.loading("Updating profile...");

    const finalData = {
      firstName: formData.firstName,   
      lastName: formData.lastName,    
      dateOfBirth: formData.dateOfBirth,
      about: formData.about,
      contactNumber: formData.contactNumber,
      gender: formData.gender,
    };

    try {
      const response = await apiConnector(
        "PUT",
        UPDATE_PROFILE_API,
        finalData,
        {
          Authorization: `Bearer ${token}`,
        }
      );

      if (!response.data.success) throw new Error(response.data.message);

      const updatedUser = response.data.updatedUser;

      // Save in Redux
      dispatch(setUser(updatedUser));

      // Save in localStorage
      localStorage.setItem("user", JSON.stringify(updatedUser));

      toast.success("Profile Updated Successfully");

    } catch (error) {
      console.log("UPDATE_PROFILE ERROR → ", error);
      toast.error("Could Not Update Profile");
    }

    toast.dismiss(toastId);
  };
}



export async function changePassword(token, formData) {
  const toastId = toast.loading("Loading...");

  try {
    const response = await apiConnector(
      "POST",
      CHANGE_PASSWORD_API,
      formData,
      { Authorization: `Bearer ${token}` }
    );

    console.log("CHANGE_PASSWORD_API API RESPONSE............", response);

    if (!response.data.success) {
      throw new Error(response.data.message || "Something went wrong");
    }

    toast.success("Password Changed Successfully");
  } catch (error) {
    console.log("CHANGE_PASSWORD_API API ERROR............", error);

    // Safe way to get message
    const errorMessage =
      error?.response?.data?.message || error.message || "Something went wrong";
    toast.error(errorMessage);
  } finally {
    // ✅ Always dismiss the loading toast
    toast.dismiss(toastId);
  }
}


export function deleteProfile(token, navigate) {
  return async (dispatch) => {
    const toastId = toast.loading("Loading...")
    try {
      const response = await apiConnector("DELETE", DELETE_PROFILE_API, null, {
        Authorization: `Bearer ${token}`,
      })

      if (!response.data.success) {
        throw new Error(response.data.message)
      }

      toast.success("Profile Deleted Successfully")
      dispatch(logout(navigate))
    } catch (error) {
      console.log("DELETE_PROFILE_API API ERROR............", error)
      toast.error("Could Not Delete Profile")
    }
    toast.dismiss(toastId)
  }
}
