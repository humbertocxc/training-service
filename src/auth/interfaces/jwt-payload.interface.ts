export interface JwtPayload {
  sub: string;
  email: string;
  name: string;
  role: string;
}

export interface UserFromJwt {
  id: string;
  email: string;
  name: string;
  role: string;
}
