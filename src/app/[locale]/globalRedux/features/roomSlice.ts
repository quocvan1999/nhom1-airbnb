"use client";

import { BookingType } from "@/types/booking/bookingType.type";
import { CommentType } from "@/types/comment/comment.type";
import { LocationType } from "@/types/location/locationType.type";
import { reqPaginationType } from "@/types/req-pagination/reqPaginationType.type";
import { RoomType } from "@/types/room/roomType.type";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type RoomSlice = {
  bookings: BookingType[];
  comments: CommentType[];
  locations: reqPaginationType<LocationType[]> | null;
  rooms: reqPaginationType<RoomType[]> | null;
};

const initialState: RoomSlice = {
  bookings: [],
  comments: [],
  locations: null,
  rooms: null,
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
    setLocations: (
      state: RoomSlice,
      action: PayloadAction<reqPaginationType<LocationType[]>>
    ) => {
      state.locations = action.payload;
    },
    setRooms: (
      state: RoomSlice,
      action: PayloadAction<reqPaginationType<RoomType[]>>
    ) => {
      state.rooms = action.payload;
    },
  },
});

export const { setBookings, setComments, setLocations, setRooms } =
  userSlice.actions;
export default userSlice.reducer;
