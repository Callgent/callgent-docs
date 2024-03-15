import { createAsyncThunk } from "@reduxjs/toolkit";
import { UserSignup, UserSignin, UserResponse, BotletResponse } from "@site/src/types/user";
import { ApiResponse } from "../index";
import axios from "@site/src/util/axios/index";
import { deleteCookie } from "@site/src/util/cookie";


// Create Botlet
export const fetchCreateBotlet = createAsyncThunk<ApiResponse<BotletResponse>, { name: string }>(
    'users/fetchCreateBotlet',
    async (userData, thunkAPI) => {
        try {
            const { data } = await axios.post('/api/botlets', userData);
            const locData = { ...data.data, ...userData, }
            localStorage.setItem('botlet', JSON.stringify(locData))
            return data;
        } catch (error) {
            return thunkAPI.rejectWithValue('Failed to fetch users');
        }
    }
);

// 用户详情
export const fetchUserInfo = createAsyncThunk<ApiResponse<UserResponse>>(
    'users/fetchUserInfo',
    async (user, thunkAPI) => {
        try {
            
            const { data } = await axios.get('/api/users/info');
            if (data.data !== null) {
                localStorage.setItem('userinfo', JSON.stringify(data.data));
            } else {
                localStorage.removeItem('userinfo')
            }
            return data;
        } catch (error) {
            return thunkAPI.rejectWithValue('Failed to fetch users');
        }
    }
);
