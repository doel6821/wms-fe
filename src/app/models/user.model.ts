export interface User {
  id: number;
  email: string;
  role: string;
}

export interface UserListResponse {
  data: User[];
  meta: {
    code: string;
    title: string;
    message: string;
  };
  count: number;
}

export interface CreateUserRequest {
  email: string;
  password: string;
  role: string;
}
