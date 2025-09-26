// src/types/auth.ts
export interface User {
    id: string;
    email: string;
    fullName: string;
    phone?: string;
    location?: string;
    isActive: boolean;
    createdAt: string;
  }
  
  export interface LoginCredentials {
    email: string;
    password: string;
  }
  
  export interface RegisterData {
    email: string;
    password: string;
    confirmPassword: string;
    fullName: string;
    phone?: string;
    location?: string;
  }
  
  export interface AuthResponse {
    user: User;
    accessToken: string;
    refreshToken: string;
  }
  
  export interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
  }