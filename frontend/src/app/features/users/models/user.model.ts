
export enum Role {
  Admin = 'Admin',
  Manager = 'Manager', 
  Volunteer = 'Volunteer'
}

export interface User {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  password?: string;
  role: Role;
  active: boolean;
  createdAt?: string;
  lastLoginAt?: string;
}

export interface CreateUserDTO {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  password: string;
  role: Role;
}

export interface UpdateUserDTO {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  role?: Role;
  active?: boolean;
}

export interface LoginDTO {
  email: string;
  password: string;
}

// ===== Interfaces pour AuthService avec JWT =====

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  password: string;
  role?: Role;
}

export interface AuthResponse {
  token: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  message?: string;
}

export interface UpdateUserRequest {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  role?: Role;
}
