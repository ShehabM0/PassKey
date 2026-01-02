# PassKey+

A modern, secure, and lightweight password management application built with TypeScript, Express.js, and GraphQL.

## Features

- **Secure Authentication**: Sign up, sign in, sign out with JWT-based authentication
- **Password Management**: Store, update, and manage credentials securely
- **Email Verification**: Email verification system for new users
- **Password Reset**: Secure password reset functionality via email
- **Security**: Built-in security features with Arcjet, Helmet, and encrypted credential storage
- **GraphQL API**: Flexible GraphQL API for credential management
- **REST API**: Traditional REST endpoints for authentication and user management
- **Docker Support**: Ready-to-deploy Docker configuration
- **Platform Icons**: Cached platform icons for better UI experience

## Tech Stack

- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js 5
- **GraphQL**: Apollo Server 5
- **Database**: PostgreSQL (via Neon Database)
- **ORM**: Drizzle ORM
- **Cache**: Redis
- **Authentication**: JWT (Access & Refresh Tokens)
- **Security**: Arcjet, Helmet
- **Email**: Nodemailer with Handlebars templates
- **Validation**: Zod
- **Logging**: Winston

## Prerequisites

- Node.js (v18 or higher)
- PostgreSQL database (or Neon Database)
- Redis server
- SMTP server credentials (for email functionality)
- Arcjet API key

## Installation

1. Clone the repository:
```bash
git clone https://github.com/ShehabM0/PassKey.git
cd PassKey
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env` file in the root directory with the following variables:

```env
PORT=3000

# Database
DATABASE_URL=postgresql://user:password@host:port/database

# Redis
REDIS_URL=redis://localhost:6379

# Arcjet
ARCJET_ENV=development
ARCJET_KEY=your_arcjet_key

# JWT Secrets
ACCESS_TOKEN=your_access_token_secret
REFRESH_TOKEN=your_refresh_token_secret

# Encryption Secret
ENC_SECRET=your_encryption_secret

# Email Configuration
EMAIL_HOST=smtp.example.com
EMAIL_PORT=587
EMAIL_USER=your_email@example.com
EMAIL_PASSWORD=your_email_password
```

4. Run database migrations:
```bash
npm run db:migrate
```

5. Start the development server:
```bash
npm run dev
```

The server will start on `http://localhost:3000` (or the port specified in your `.env` file).

## Docker Deployment

1. Build and run with Docker Compose:
```bash
docker-compose up -d
```

Or build the Docker image manually:
```bash
docker build -t passkey .
docker run -p 3000:3000 --env-file .env passkey
```

## Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run prod` - Start production server
- `npm run build` - Compile TypeScript to JavaScript
- `npm run db:generate` - Generate database migration files
- `npm run db:migrate` - Run database migrations

## API Endpoints

### REST API

#### Authentication Routes (`/api/auth`)
- `POST /api/auth/sign-up` - Register a new user
- `POST /api/auth/sign-in` - Sign in an existing user
- `POST /api/auth/sign-out` - Sign out the current user
- `POST /api/auth/refresh` - Refresh access token

#### User Routes (`/api/users`)
- `GET /api/users/:id/email/verify` - Send email verification
- `GET /api/users/:id/email/verify/:token` - Verify email with token
- `POST /api/users/password/reset` - Request password reset
- `POST /api/users/:id/password/reset/:token` - Reset password with token
- `PATCH /api/users/password/update/` - Update password (authenticated)
- `GET /api/users/password/update/:token` - Verify password update token

### GraphQL API (`/graphql`)

The GraphQL API provides the following operations:

#### Queries
- `me` - Get current user information with paginated credentials
- `platform.fetch(offset, limit)` - Fetch platforms with pagination
- `platform.filter(query)` - Filter platforms by query string

#### Mutations
- `createCredential(platformTitle, email, password)` - Create a new credential
- `updateCredential(credentialId, email, password)` - Update an existing credential
- `deleteCredential(credentialId)` - Delete a credential

## Security Features

- **Password Hashing**: bcrypt for secure password storage
- **Token-based Authentication**: JWT with access and refresh tokens
- **Credential Encryption**: Encrypted storage of user credentials
- **Rate Limiting**: Arcjet integration for DDoS protection and rate limiting
- **Security Headers**: Helmet.js for secure HTTP headers
- **Input Validation**: Zod schemas for request validation
- **Token Rotation**: Refresh token rotation for enhanced security

## License

MIT License - see [LICENSE](LICENSE) file for details