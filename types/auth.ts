export interface RegisterFormData {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
    phone?: string;
  }

export interface LoginFormData {
    email: string;
    password: string;
}