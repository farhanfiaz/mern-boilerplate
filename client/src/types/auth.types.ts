export interface User {
    email?: string;
    password: string;
    isRemember: boolean;
}

export type AuthResponse = {
  user: JWTTokenUserInfo;
  token: string;
  refreshToken: string;
};

export type JWTTokenUserInfo = {
  userId: string;
  email: string;
  name: string;
  userIamge: string;
}

export interface AuthContextType {
    user: AuthResponse | null;
    login: (user: User) => void;
    logout: () => void;
}