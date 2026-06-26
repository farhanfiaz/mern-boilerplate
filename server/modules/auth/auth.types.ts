export type LoginDto = {
  email: string;
  password: string;
};

export type RegisterDto = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  file: Express.Multer.File | null;
  tenantId: string;
};

export type AuthResponse = {
  user: JWTTokenUserInfo;
  token: string;
  refreshToken: string;
};
export type Role = {
  id: string;
  name: string;
  isSystem: boolean;
};
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