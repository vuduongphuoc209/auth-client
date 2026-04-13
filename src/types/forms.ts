export interface UserFormValues {
  fullName: string;
  email: string;
  phone?: string;
  password?: string;
  isAdmin?: boolean;
}
export interface ProfileFormValues {
  fullName: string;
  email: string;
  phone?: string;
  password?: string;
}
export interface ForgotPasswordFormValues {
  email: string;
}

export interface RegisterFormValues {
  fullName: string;
  email: string;
  phone?: string;
  password: string;
  confirmPassword: string;
}
