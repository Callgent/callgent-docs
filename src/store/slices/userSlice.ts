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
    token: getCookie('jwt'),
    fetchState: {},
  } as userSliceType,
  reducers: {
    setStatus: (state, data) => {
      state.status = { ...state.status, ...data.payload }
    },
    setCallgent: (state) => {
      const data = JSON.parse(localStorage.getItem('callgent'));
      state.callgent = data;
    },
    setFetchState: (state, data) => {
      // state.fetchState = data;
    },
  },
  extraReducers: (builder) => {
    // 注册接口
    builder.addCase(fetchCreateCallgent.fulfilled, (state, action) => {
      // console.log(action.payload.data);

      state.callgent = action.payload.data
    });
    builder.addCase(fetchCreateCallgent.pending, (state, action) => {
      // state.loading = true;
    });
    // 用户详情
    builder.addCase(fetchUserInfo.fulfilled, (state, action) => {
      // console.log('用户详情', action);

    });
  },
});

export const { setStatus, setCallgent,setFetchState } = userSlice.actions;
export default userSlice.reducer;