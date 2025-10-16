// Response DTO after successful authentication
// Contains the JWT access token and user info
export class AuthResponseDto {
  access_token: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
}
