"use client";

import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./features/userSlice";
import roomSlice from "./features/roomSlice";

export const store = configureStore({
  reducer: {
    user: userSlice,
    room: roomSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
