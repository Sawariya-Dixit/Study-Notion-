import axios from "axios";

export const axiosInstance = axios.create({});

export const apiConnector = async (
  method,
  url,
  bodyData,
  headers = {},
  params = {}
) => {

  // 🔑 TOKEN (SAFE PARSE)
  const token = localStorage.getItem("token")
    ? JSON.parse(localStorage.getItem("token"))
    : null;

  const isFormData = bodyData instanceof FormData;

  // ---------------- FORM-DATA REQUEST ----------------
  if (isFormData) {
    const fetchHeaders = {
      ...headers,
    };

    if (token) {
      fetchHeaders.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(url, {
      method,
      body: bodyData,
      headers: fetchHeaders,
      credentials: "include",
    });

    const data = await response.json();

    return {
      data,
      status: response.status,
      statusText: response.statusText,
    };
  }

  // ---------------- NORMAL AXIOS REQUEST ----------------
  return axiosInstance({
    method,
    url,
    data: bodyData ?? null,
    headers: {
      ...headers,
      Authorization: token ? `Bearer ${token}` : undefined,
    },
    params: params ?? null,
    withCredentials: true,
  });
};
