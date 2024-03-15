import { createSlice } from "@reduxjs/toolkit";
import { fetchCreateBotlet, fetchUserInfo } from "../thunk";
import { UserResponse, userSliceType } from "@site/src/types/user";
import { getCookie } from "@site/src/util/cookie"

const userSlice = createSlice({
  name: "users",
  initialState: {
    userData: {},
    botlet: {},
    status: {},
    token: getCookie('jwt'),
    fetchState: {},
  } as userSliceType,
  reducers: {
    setStatus: (state, data) => {
      state.status = { ...state.status, ...data.payload }
    },
    setBotlet: (state) => {
      const data = JSON.parse(localStorage.getItem('botlet'));
      state.botlet = data;
    },
    setFetchState: (state, data) => {
      // state.fetchState = data;
    },
  },
  extraReducers: (builder) => {
    // 注册接口
    builder.addCase(fetchCreateBotlet.fulfilled, (state, action) => {
      // console.log(action.payload.data);

      state.botlet = action.payload.data
    });
    builder.addCase(fetchCreateBotlet.pending, (state, action) => {
      // state.loading = true;
    });
    // 用户详情
    builder.addCase(fetchUserInfo.fulfilled, (state, action) => {
      // console.log('用户详情', action);

    });
  },
});

export const { setStatus, setBotlet,setFetchState } = userSlice.actions;
export default userSlice.reducer;