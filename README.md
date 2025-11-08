# Asset Management SaaS

A modern web application for managing community appliances and assets built with Next.js, TypeScript, and Prisma.

## Features

- 🔐 **Authentication**: Google OAuth with NextAuth.js
- 🏢 **Multi-site Management**: Manage assets across multiple locations
- 📦 **Asset Tracking**: Track appliances with detailed information
- 👥 **Role-based Access**: Different permission levels (Super Admin, Admin, Site Manager)
- 📱 **Responsive Design**: Mobile-friendly interface with Tailwind CSS
- 🗄️ **Database Management**: SQLite for development (easily upgradeable to PostgreSQL)

## Tech Stack

- **Frontend**: Next.js 16 with App Router, React 19, TypeScript
- **Styling**: Tailwind CSS
- **Database**: SQLite with Prisma ORM
- **Authentication**: NextAuth.js with Google OAuth
- **Form Handling**: React Hook Form with Zod validation
- **Development**: TypeScript, ESLint

## Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn
- Google OAuth credentials (optional - app now supports email/password login)

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd asset_management
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Copy the example file and update as needed:
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` file:
   ```env
   # Database
   DATABASE_URL="file:./dev.db"
   
   # NextAuth.js
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="your-nextauth-secret-here"
   
   # Google OAuth (optional)
   GOOGLE_CLIENT_ID="your-google-client-id"
   GOOGLE_CLIENT_SECRET="your-google-client-secret"
   ```

4. **Set up the database**
   ```bash
   # Reset and seed the database
   npx prisma db push --force-reset
   npm run db:seed
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

### Authentication Options

**Email/Password Login (Recommended for Testing):**
- No additional setup required
- Use the "Sign Up" option on the login page to create an account
- Supports roles: Site Manager, Admin, Super Admin

**Google OAuth (Optional):**
- Provides seamless social login
- Requires Google Cloud Console setup

#### Getting Google OAuth Credentials (Optional)

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API
4. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client ID"
5. Set the authorized redirect URI to: `http://localhost:3000/api/auth/callback/google`
6. Copy the Client ID and Client Secret to your `.env` file

### Generating NextAuth Secret

```bash
openssl rand -base64 32
```

## Database Schema

The application uses Prisma with SQLite for development. Key entities:

- **Users**: Managed through Google OAuth with role-based permissions
- **Sites**: Physical locations where assets are stored
- **Assets**: Appliances and equipment with detailed tracking
- **AssetImages**: Image attachments for assets

## User Roles

- **SUPER_ADMIN**: Full access to all features and data
- **ADMIN**: Access to user management and all assets
- **SITE_MANAGER**: Limited to assets at assigned sites

## API Endpoints

### Assets
- `GET /api/assets` - List all assets (filtered by user permissions)
- `POST /api/assets` - Create new asset
- `GET /api/assets/[id]` - Get specific asset details
- `PATCH /api/assets/[id]` - Update asset
- `DELETE /api/assets/[id]` - Delete asset (admin only)

### Sites
- `GET /api/sites` - List all sites
- `POST /api/sites` - Create new site (admin only)

### Users (Admin Only)
- `GET /api/users` - List all users

## Development

### Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run db:seed      # Seed database with sample data
```

### Database Commands

```bash
npx prisma studio    # Open Prisma Studio (GUI for database)
npx prisma generate  # Generate Prisma client
npx prisma migrate dev --name init  # Create initial migration
npx prisma db push   # Push schema changes to database
```

### Code Quality

- **TypeScript**: Full type safety throughout the application
- **ESLint**: Code linting with Next.js recommended rules
- **Form Validation**: Zod schemas for runtime type checking
- **Error Handling**: Comprehensive error boundaries and API error responses

## Deployment

### Production Database

For production, switch from SQLite to PostgreSQL:

1. Update `DATABASE_URL` in your environment variables:
   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/asset_management"
   ```

2. Update `prisma/schema.prisma`:
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```

3. Run migrations:
   ```bash
   npx prisma migrate deploy
   ```

### Deployment Platforms

This application can be deployed to:
- **Vercel** (recommended for Next.js)
- **Netlify**
- **Railway**
- **DigitalOcean App Platform**

## Troubleshooting

### Common Issues

1. **"Cannot resolve module" errors**
   - Ensure all dependencies are installed: `npm install`
   - Check that the `@/` alias is configured in `tsconfig.json`

2. **Database connection errors**
   - Verify `DATABASE_URL` in `.env.local`
   - Run `npx prisma generate` after changing database settings

3. **Authentication not working**
   - Check Google OAuth credentials
   - Verify `NEXTAUTH_URL` and `NEXTAUTH_SECRET` are set
   - Ensure redirect URI is correctly configured in Google Console

4. **Build errors**
   - Run `npm run lint` to check for code issues
   - Ensure all environment variables are set for production builds

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Make your changes and add tests
4. Run linting: `npm run lint`
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For issues and questions, please open an issue in the GitHub repository.
