import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slices/userSlice";

export function makeStore() {
  return configureStore({
    reducer: {
      user: userReducer,
    },
  });
}

export const store = makeStore();
