import { User, LoginResponse } from '../types/auth';
import { ApiService } from './apiService';

class AuthService {
  async login(email: string, password: string): Promise<LoginResponse> {
    try {
      const response = await ApiService.login(email, password);
      return response;
    } catch (error: any) {
      // If the error is already a specific network-related error from ApiService,
      // re-throw it directly to avoid duplicate messages
      if (error.message && (
        error.message.includes('Unable to connect to server') ||
        error.message.includes('Network Error') ||
        error.code === 'ERR_NETWORK'
      )) {
        throw error;
      }
      
      // For other errors, provide a generic fallback
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  }

  async validateToken(token: string): Promise<User> {
    try {
      const response = await ApiService.validateToken();
      return response;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Token validation failed');
    }
  }

  async logout(): Promise<void> {
    try {
      await ApiService.logout();
    } catch (error) {
      // Logout should always succeed locally
      console.warn('Logout request failed, but continuing with local logout');
    }
  }
}

export const authService = new AuthService();