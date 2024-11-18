"use client";

import { BookingType } from "@/types/booking/bookingType.type";
import { reqPaginationType } from "@/types/req-pagination/reqPaginationType.type";
import { User } from "@/types/user/userType.type";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { stat } from "fs";

type UserSlice = {
  profile: User;
  bookings: BookingType[];
  users: reqPaginationType<User[]> | null;
};

const defaultProfile: User = {
  id: 0,
  avatar: "",
  birthday: "",
  email: "",
  gender: false,
  name: "",
  password: "",
  phone: "",
  role: "",
};

const initialState: UserSlice = {
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
  bookings: [],
  users: null,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setProfile: (state: UserSlice, action: PayloadAction<User>) => {
      state.profile = action.payload;
    },
    resetProfile: (state: UserSlice) => {
      state.profile = defaultProfile;
    },
    setBooking: (state: UserSlice, action: PayloadAction<BookingType[]>) => {
      state.bookings = action.payload;
    },
    setUsers: (
      state: UserSlice,
      action: PayloadAction<reqPaginationType<User[]>>
    ) => {
      state.users = action.payload;
    },
  },
});

export const { setProfile, setBooking, setUsers, resetProfile } =
  userSlice.actions;
export default userSlice.reducer;
