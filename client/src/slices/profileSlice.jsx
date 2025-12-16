import { createSlice } from "@reduxjs/toolkit";

//  SAFE USER PARSING — prevents crash if "undefined" was stored
const getSafeUser = () => {
  const data = localStorage.getItem("user");
  try {
    return data ? JSON.parse(data) : null;
  } catch {
    // Agar galat JSON mila → delete & return null
    localStorage.removeItem("user");
    return null;
  }
};

const initialState = {
  user: getSafeUser(),
  loading: false,
};

const profileSlice = createSlice({
  name: "profile",
  initialState: initialState,
  reducers: {
    setUser(state, action) {
      state.user = action.payload;

    },
    setLoading(state, action) {
      state.loading = action.payload;
    },
  },
});

export const { setUser, setLoading } = profileSlice.actions;
export default profileSlice.reducer;
