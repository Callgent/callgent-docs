import { createAsyncThunk } from "@reduxjs/toolkit";
import { UserSignup, UserSignin, UserResponse, CallgentResponse } from "@site/src/types/user";
import { ApiResponse } from "../index";
import axios from "@site/src/util/axios/index";
import { deleteCookie } from "@site/src/util/cookie";


// Create Callgent
export const fetchCreateCallgent = createAsyncThunk<ApiResponse<CallgentResponse>, { name: string }>(
    'users/fetchCreateCallgent',
    async (userData, thunkAPI) => {
        try {
            const { data } = await axios.post('/api/callgents', userData);
            const locData = { ...data.data, ...userData, }
            localStorage.setItem('callgent', JSON.stringify(locData))
            return data;
        } catch (error) {
            return thunkAPI.rejectWithValue('Failed to fetch users');
        }
    }
);

// User details
export const fetchUserInfo = createAsyncThunk<ApiResponse<UserResponse>>(
    'users/fetchUserInfo',
    async (user, thunkAPI) => {
        try {

            const { data } = await axios.get('/api/users/info');
            if (data?.data) {
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

// Send a confirmation email
export const sendConfirmEmail = createAsyncThunk<ApiResponse<any>, { email: string }>(
    'users/sendConfirmEmail',
    async (emailData, thunkAPI) => {
        try {
            const { data } = await axios.post('/api/users/send-confirm-email', {
                email: emailData.email,
                create: true,
                resetPwd: true,
            });
            return data;
        } catch (error) {
            return thunkAPI.rejectWithValue('Failed to send confirmation email');
        }
    }
);