export interface User {
  id: string;
  email: string;
  name: string;
  role: 'radiologist' | 'admin' | 'technician';
  department?: string;
  avatar?: string;
  lastLogin?: Date;
}

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  token: string;
}