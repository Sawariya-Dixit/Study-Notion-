import axios from "axios";

export const axiosInstance = axios.create({});

export const apiConnector = async (
  method,
  url,
  bodyData,
  headers = {},
  params
) => {
  // 🔑 TOKEN AUTO ATTACH
  const token = localStorage.getItem("token");
  if (token) {
    headers.Authorization = `Bearer ${JSON.parse(token)}`;
  }

  const isFormData = bodyData instanceof FormData;

  // ---------------- FORM-DATA REQUEST ----------------
  if (isFormData) {
    const response = await fetch(url, {
      method,
      body: bodyData,
      headers,              //Authorization yahin se jayega
      credentials: "include",
    });

    const data = await response.json();

    return {
      data,
      status: response.status,
      statusText: response.statusText,
    };
  }

  // ---------------- AXIOS REQUEST ----------------
  return axiosInstance({
    method,
    url,
    data: bodyData ?? null,
    headers,               //  Authorization yahin se jayega
    params: params ?? null,
    withCredentials: true,
  });
};
