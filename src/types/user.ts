export type UserSignin = {
    email: string;
    password: string;
}

export type UserSignup = {
    name: string;
    email: string;
    password: string;
}


export type UserResponse = {
    avatar?: string
}

export type CallgentResponse = {
    name?: string;
    createdAt?: string;
    uuid?: string;
    updatedAt?: string;
}

export type CallgentState = {
    isCreate?: boolean;
}

export type FetchStateType = {
    isShow?: boolean;
    message?: any;
}

export type userSliceType = {
    userData: UserResponse,
    callgent: CallgentResponse,
    token: string | null,
    status: CallgentState;
    fetchState: FetchStateType;
}


export type DocType = {
    user: userSliceType;
}