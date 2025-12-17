import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  signupData: null,
  loading: false,
  token:localStorage.getItem("token") || null,
};

const authSlice = createSlice({
  name: "auth",
  initialState: initialState,
  reducers: {
    setSignupData(state, action) {
      state.signupData = action.payload;
    },
    setLoading(state, action) {
      state.loading = action.payload;
    },
    setToken(state, action) {
      state.token = action.payload;
    },

  
    setAuthLogout(state) {
      state.token = null;
      state.loading = false;
      state.signupData = null;
    },
  },
});

export const { setSignupData, setLoading, setToken, setAuthLogout } =
  authSlice.actions;

export default authSlice.reducer;
