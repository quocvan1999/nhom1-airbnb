"use client";

import { BookingType } from "@/types/booking/bookingType.type";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type RoomSlice = {
  bookings: BookingType[];
};

const initialState: RoomSlice = {
  bookings: [],
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setBookings: (state: RoomSlice, action: PayloadAction<BookingType[]>) => {
      state.bookings = action.payload;
    },
  },
});

export const { setBookings } = userSlice.actions;
export default userSlice.reducer;
