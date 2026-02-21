export interface User {
  id: string;
  email: string;
  name?: string;
  email_confirm?: boolean;
}

export interface SignupCredentials {
  name: string;
  email: string;
  password: string;
}

export interface SigninCredentials {
  email: string;
  password: string;
}

export interface RefreshResponse {
  accessToken: string;
  refreshToken: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticating: boolean;
  isAuthenticated: boolean;
  refreshUser: () => Promise<User>;
  signup: (credentials: SignupCredentials) => Promise<void>;
  signin: (credentials: SigninCredentials) => Promise<void>;
  signout: () => Promise<void>;
}


export interface PasswordReset {
  token: string;
  password: string;
}

export interface PasswordUpdate {
  oldPassword: string;
  newPassword: string;
}


export interface PlatformDAO {
  name: string;
  icon: string;
}

export interface CredentialDAO {
  email: string;
  password: string;
}

export interface SuccessMessageProps {
  message: string;
}
