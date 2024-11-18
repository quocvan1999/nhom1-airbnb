"use client";

import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type StatusAppSlice = {
  isLoadingNotification: boolean;
};

const initialState: StatusAppSlice = {
  isLoadingNotification: false,
};

export const statusAppSlice = createSlice({
  name: "statusApp",
  initialState,
  reducers: {
    setIsLoadingNotification: (state: StatusAppSlice) => {
      state.isLoadingNotification = !state.isLoadingNotification;
    },
  },
});

export const { setIsLoadingNotification } = statusAppSlice.actions;
export default statusAppSlice.reducer;
