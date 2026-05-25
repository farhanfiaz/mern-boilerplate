export interface User {
  email?: string;
  password: string;
  isRemember: boolean;
}
export interface RegisterUser {
  email?: string;
  password: string;
  firstName: string;
  lastName: string;
}

export type AuthResponse = {
  user: JWTTokenUserInfo;
  token: string;
  refreshToken: string;
};

export type Role = {
  Id: string;
  name: string;
}

export type JWTTokenUserInfo = {
  userId: string;
  email: string;
  name: string;
  userIamge: string;
  role: Role[];
}

export interface AuthContextType {
  user: AuthResponse | null;
  login: (user: User) => void;
  logout: () => void;
  register: (user: RegisterUser) => void;
}