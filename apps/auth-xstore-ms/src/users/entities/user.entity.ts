import { Role } from '../../auth/enums/role.enum';

// This defines the User entity/interface
// What a user looks like in your system
export interface User {
  id: string;
  name: string;
  email: string;
  password: string; // Added for authentication
  role: Role;
  createdAt: Date;
}
