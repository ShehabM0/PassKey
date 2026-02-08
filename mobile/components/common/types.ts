interface PlatformDAO {
  name: string;
  icon: string;
}

interface CredentialDAO {
  email: string;
  password: string;
}

export {PlatformDAO, CredentialDAO}