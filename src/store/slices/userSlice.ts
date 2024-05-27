import { createSlice } from "@reduxjs/toolkit";
import { fetchCreateCallgent, fetchUserInfo } from "../thunk";
import { UserResponse, userSliceType } from "@site/src/types/user";
import { getCookie } from "@site/src/util/cookie"

const userSlice = createSlice({
  name: "users",
  initialState: {
    userData: {},
    callgent: {},
    status: {},
    token: getCookie('x-callgent-jwt'),
    fetchState: {},
  } as userSliceType,
  reducers: {
    setStatus: (state, data) => {
      state.status = { ...state.status, ...data.payload }
    },
    setCallgent: (state) => {
      let userInfo: any = localStorage.getItem('userinfo');
      userInfo = userInfo && JSON.parse(userInfo);
      state.callgent = userInfo;
    },
    setFetchState: (state, data) => {
      // state.fetchState = data;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchCreateCallgent.fulfilled, (state, action) => {
      state.callgent = action.payload.data
    });
    builder.addCase(fetchCreateCallgent.pending, (state, action) => {
      // state.loading = true;
    });
    builder.addCase(fetchUserInfo.fulfilled, (state, action) => {

    });
  },
});

export const { setStatus, setCallgent, setFetchState } = userSlice.actions;
export default userSlice.reducer;