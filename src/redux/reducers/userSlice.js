import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  data: [],
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    login: async (state, action) => {
      //state.data.push({ details: action.payload });
    },
    logout: (state, action) => {
      state.data.pop();
    },
  },
});
export const { login, logout } = userSlice.actions;

export default userSlice.reducer;
