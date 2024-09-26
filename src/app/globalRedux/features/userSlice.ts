"use client";

import { BookingType } from "@/types/booking/bookingType.type";
import { User } from "@/types/user/userType.type";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type UserSlice = {
  profile: User;
  bookings: BookingType[];
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
  },
});

export const { setProfile, setBooking } = userSlice.actions;
export default userSlice.reducer;
