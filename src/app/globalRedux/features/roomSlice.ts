"use client";

import { BookingType } from "@/types/booking/bookingType.type";
import { CommentType } from "@/types/comment/comment.type";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type RoomSlice = {
  bookings: BookingType[];
  comments: CommentType[];
};

const initialState: RoomSlice = {
  bookings: [],
  comments: [],
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setBookings: (state: RoomSlice, action: PayloadAction<BookingType[]>) => {
      state.bookings = action.payload;
    },
    setComments: (state: RoomSlice, action: PayloadAction<CommentType[]>) => {
      state.comments = action.payload;
    },
  },
});

export const { setBookings, setComments } = userSlice.actions;
export default userSlice.reducer;
