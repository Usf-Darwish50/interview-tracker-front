export interface LoginResponse {
  success: boolean;
  user?: {
    username: string;
    role: string;
  };
  message?: string;
}

export interface Credentials {
  username: string;
  password: string;
}
