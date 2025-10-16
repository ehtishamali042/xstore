// DTO = Data Transfer Object
// This defines what data is required to CREATE a user
export class CreateUserDto {
  name: string;
  email: string;
  role?: string; // Optional field
}
