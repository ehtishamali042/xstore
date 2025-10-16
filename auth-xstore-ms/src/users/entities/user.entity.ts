// This defines the User entity/interface
// What a user looks like in your system
export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: Date;
}
