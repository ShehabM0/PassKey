# PassKey+

A modern, secure, and lightweight password management mobile application built with React Native, GraphQL, and Node.js.

## A quick look inside Notify.

<div align="center">
  <a href="https://drive.google.com/file/d/1ajVq1QNK3G6P1XT7RKL1WxhwOpS6h041/view?usp=sharing" target="_blank">
      <img src="https://drive.google.com/uc?id=1boy7yhrzPdPHwLq1tixzHxybWRhfxrgu" height="450"/>
  </a>
</div>

## Features

- **Secure Authentication** - JWT-based with access & refresh tokens
- **Credential Management** - Store, update, and delete passwords
- **Platform Icons** - 7,000+ brand icons with official colors (simple-icons)
- **Email Verification** - Verify account via email link
- **Password Reset** - Secure reset via email
- **GraphQL API** - Flexible queries and mutations
- **Cross-Platform** - iOS, Android, and Web support

## Tech Stack

### Mobile
- Expo SDK 54 (React Native 0.81.5)
- TypeScript
- Apollo Client 4 (GraphQL)
- expo-router 6
- React Context for state

### Backend
- Node.js + TypeScript
- Express 5
- Apollo Server 5 (GraphQL)
- Drizzle ORM + PostgreSQL (Neon)
- Redis for caching/sessions
- JWT + bcrypt

## Getting Started

### Prerequisites

- Node.js 18+
- Docker (optional, for backend)
- Expo Go app (for mobile development)
- Neon Database account
- Redis instance
- SMTP credentials (for emails)

### Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env
# Edit .env with your credentials

# Run database migrations
npm run db:migrate

# Start development server
npm run dev
```

**Environment Variables:**
```env
PORT=3000
DATABASE_URL=postgresql://...
REDIS_URL=redis://...
ACCESS_TOKEN=your_secret
REFRESH_TOKEN=your_secret
ACCESS_TOKEN_EXPIRES=your_est_date
REFRESH_TOKEN_EXPIRES=your_est_date
ENC_SECRET=your_encryption_key
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email
EMAIL_PASSWORD=your_app_password
```

### Backend with Docker

```bash
cd backend
docker build -t passkey .
docker run -p 3000:3000 --env-file .env passkey
```

### Mobile Setup

```bash
cd mobile

# Install dependencies
npm install

# Start development
npx expo start
```

**Mobile Environment:**
```env
EXPO_PUBLIC_API_URL=http://10.0.2.2:3000/api  # Android emulator
EXPO_PUBLIC_API_URL=http://localhost:3000/api # iOS simulator
```

## API Reference

### GraphQL

```graphql
# Get current user with credentials
query Me {
  me {
    id
    name
    email
    credentials(page: 1, limit: 10) {
      data {
        id
        platformTitle
        email
      }
    }
  }
}

# Create credential
mutation CreateCredential($platformTitle: String!, $email: String!, $password: String!) {
  createCredential(platformTitle: $platformTitle, email: $email, password: $password) {
    id
    platformTitle
  }
}
```

### REST Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/sign-up` | Register user |
| POST | `/api/auth/sign-in` | Login |
| POST | `/api/auth/refresh` | Refresh token |
| POST | `/api/auth/sign-out` | Logout |
| POST | `/api/users/password/request-reset` | Request password reset |
| POST | `/api/users/password/reset/:token` | Reset password |

## Security

- Passwords hashed with bcrypt
- JWT access tokens (short-lived)
- JWT refresh tokens (long-lived)
- Credentials encrypted at rest
- Helmet.js security headers
- Arcjet rate limiting & protection
- Zod input validation

## License

MIT License - see [LICENSE](LICENSE) file for details
