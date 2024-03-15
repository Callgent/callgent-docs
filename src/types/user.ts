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

export type BotletResponse = {
    name?: string;
    createdAt?: string;
    uuid?: string;
    updatedAt?: string;
}

export type BotletState = {
    isCreate?: boolean;
}

export type FetchStateType = {
    isShow?: boolean;
    message?: any;
}

export type userSliceType = {
    userData: UserResponse,
    botlet: BotletResponse,
    token: string | null,
    status: BotletState;
    fetchState: FetchStateType;
}


export type DocType = {
    user: userSliceType;
}