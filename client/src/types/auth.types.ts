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
  id: string;
  name: string;
  isSystem: boolean;
}

export type JWTTokenUserInfo = {
  userId: string;
  email: string;
  name: string;
  userIamge: string;
  role: Role[];
  tenantId: string;
  firstName: string;
  lastName: string;
}

export interface AuthContextType {
  user: AuthResponse | null;
  login: (user: User) => void;
  logout: () => void;
  register: (user: RegisterUser) => void;
  updateTenant: (tenantId: string) => void;
}