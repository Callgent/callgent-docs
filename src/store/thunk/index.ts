// 用户接口
export * from './user/index';






// 接口类型
export interface ApiResponse<T> {
    statusCode?: number;
    message?: string | string[];
    data?: T;
    meta?: any;
}