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
    setBooking: (state: UserSlice, action: PayloadAction<BookingType[]>) => {
      state.bookings = action.payload;
    },
    setUsers: (
      state: UserSlice,
      action: PayloadAction<reqPaginationType<User[]>>
    ) => {
      console.log("kiem tra payload", action.payload);

      state.users = action.payload;
    },
  },
});

export const { setProfile, setBooking, setUsers } = userSlice.actions;
export default userSlice.reducer;
