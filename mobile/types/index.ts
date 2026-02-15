interface User {
  id: string;
  email: string;
  name?: string;
}

interface SignupCredentials {
  name: string;
  email: string;
  password: string;
}

interface SigninCredentials {
  email: string;
  password: string;
}

interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  signup: (credentials: SignupCredentials) => Promise<void>;
  signin: (credentials: SigninCredentials) => Promise<void>;
  signout: () => Promise<void>;
}


interface PlatformDAO {
  name: string;
  icon: string;
}

interface CredentialDAO {
  email: string;
  password: string;
}

interface SuccessMessageProps {
  message: string;
}

export { 
  User, SignupCredentials, SigninCredentials, AuthResponse, AuthContextType,
  PlatformDAO, CredentialDAO, SuccessMessageProps
}