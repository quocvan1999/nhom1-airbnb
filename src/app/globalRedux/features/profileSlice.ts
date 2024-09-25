"use client";

import { User } from "@/types/user/userType.type";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type ProfileSlice = {
  profile: User;
};

const initialState: ProfileSlice = {
  profile: {
    id: 0,
    avatar: "",
    birthday: "",
    email: "",
    gender: false,
    name: "",
    password: "",
    phone: "",
    role: "",
  },
};

export const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    setProfile: (state: ProfileSlice, action: PayloadAction<User>) => {
      state.profile = action.payload;
    },
  },
});

export const { setProfile } = profileSlice.actions;
export default profileSlice.reducer;
