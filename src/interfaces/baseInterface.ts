
export interface ApiResponse {
    success: boolean;
    responseCode?: string;
    message?: string;
    data: <T>() => T[];
}
export interface UpdatePasswordDtls {
    oldPassword: string,
    newPassword: string,
    retypePassword: string
}

export interface UserDtls {
    id: number;
    name: string;
    email: string;
    role: string;
    avatar: string;
}