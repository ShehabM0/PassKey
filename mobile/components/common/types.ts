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

export { PlatformDAO, CredentialDAO, SuccessMessageProps }