"use client";

import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./features/userSlice";
import roomSlice from "./features/roomSlice";
import statusAppSlice from "./features/statusAppSlice";

export const store = configureStore({
  reducer: {
    user: userSlice,
    room: roomSlice,
    statusAppSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
