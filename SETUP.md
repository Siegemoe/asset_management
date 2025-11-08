# Asset Management SaaS - Setup Guide

## 📋 Overview

The Asset Management SaaS application is now fully functional and ready for local development. This guide will help you set up the application on your local machine.

## 🚀 Quick Start

### Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (version 18 or higher)
- **npm** (comes with Node.js)
- **Git** (for version control)

### 1. Installation

1. **Clone/Download the Repository**
   ```bash
   # If using Git
   git clone <your-repo-url>
   cd asset_management
   
   # Or extract the downloaded ZIP file
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

### 2. Environment Configuration

1. **Copy Environment Template**
   ```bash
   cp .env.example .env
   ```

2. **Configure Environment Variables**
   
   Open `.env` file and configure the following:

   ```env
   # Database
   DATABASE_URL="file:./dev.db"
   
   # NextAuth.js
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="your-secret-key-here"
   
   # Google OAuth (Optional)
   GOOGLE_CLIENT_ID="your-google-client-id"
   GOOGLE_CLIENT_SECRET="your-google-client-secret"
   ```

   **Generate NextAuth Secret:**
   ```bash
   openssl rand -base64 32
   ```

3. **Database Setup**
   ```bash
   # Generate Prisma client
   npx prisma generate
   
   # Run database migrations
   npx prisma db push
   
   # Seed the database with sample data
   npm run db:seed
   ```

### 3. Development Server

1. **Start the Development Server**
   ```bash
   npm run dev
   ```

2. **Access the Application**
   - Open your browser and navigate to: `http://localhost:3000`
   - The application should load successfully

## 🏗️ Build and Production

### Building for Production

```bash
# Build the application
npm run build

# Start production server
npm start
```

### Type Checking and Linting

```bash
# Run TypeScript type checking
npm run type-check

# Run ESLint
npm run lint

# Fix linting issues
npm run lint -- --fix
```

## 📱 Application Features

### 🔐 Authentication
- **Login/Register** with email/password
- **Google OAuth** integration (optional)
- Role-based access control:
  - **SUPER_ADMIN**: Full system access
  - **ADMIN**: Site and user management
  - **SITE_MANAGER**: Asset management for assigned sites

### 🏢 Site Management
- Create and manage multiple sites
- Assign users to sites
- View site-specific analytics

### 🏠 Room Management
- Create rooms within sites
- Organize assets by room location

### 📦 Asset Management
- Add, edit, and view assets
- Support for multiple appliance types:
  - Washer, Dryer, Dishwasher
  - Refrigerator, Air Conditioner, Oven/Stove
- Asset images and detailed specifications
- Automatic asset numbering system

### 👥 User Management (Admin Only)
- View all users
- Assign roles and site permissions
- User account management

## 🗄️ Database

### Supported Databases
- **SQLite** (default for development)
- **PostgreSQL** (recommended for production)
- **MySQL** (supported)

### Database Commands

```bash
# View database in browser
npx prisma studio

# Reset database
npx prisma db push --force-reset

# Create and apply migrations
npx prisma migrate dev --name migration_name
```

## 🛠️ Development Workflow

### Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   │   ├── assets/        # Asset CRUD operations
│   │   ├── sites/         # Site management
│   │   ├── users/         # User management
│   │   └── rooms/         # Room management
│   ├── assets/            # Asset pages
│   ├── sites/             # Site management pages
│   ├── admin/             # Admin interface
│   └── dashboard/         # Dashboard
├── components/            # Reusable components
├── lib/                   # Utility libraries
│   ├── auth.ts           # Authentication helpers
│   └── prisma.ts         # Database client
└── types/                 # TypeScript type definitions
```

### Key Technologies

- **Framework**: Next.js 16 (App Router)
- **Database**: Prisma ORM with SQLite/PostgreSQL
- **Authentication**: NextAuth.js
- **UI**: Tailwind CSS
- **Forms**: React Hook Form with Zod validation
- **State Management**: React hooks
- **Type Safety**: TypeScript

## 🔧 Troubleshooting

### Common Issues

1. **Build Failures**
   ```bash
   # Clear Next.js cache
   rm -rf .next
   
   # Reinstall dependencies
   rm -rf node_modules package-lock.json
   npm install
   
   # Rebuild
   npm run build
   ```

2. **Database Issues**
   ```bash
   # Reset database
   npx prisma db push --force-reset
   npm run db:seed
   ```

3. **Port Already in Use**
   ```bash
   # Kill process on port 3000
   npx kill-port 3000
   ```

### Getting Help

- Check the console for error messages
- Ensure all environment variables are set correctly
- Verify database connectivity
- Check the build logs for TypeScript errors

## 📝 Environment Variables Reference

| Variable | Description | Required | Example |
|----------|-------------|----------|---------|
| `DATABASE_URL` | Database connection string | Yes | `file:./dev.db` |
| `NEXTAUTH_URL` | Application URL | Yes | `http://localhost:3000` |
| `NEXTAUTH_SECRET` | Secret key for NextAuth | Yes | `your-secret-here` |
| `GOOGLE_CLIENT_ID` | Google OAuth Client ID | No | `your-client-id` |
| `GOOGLE_CLIENT_SECRET` | Google OAuth Client Secret | No | `your-client-secret` |

## 🎯 Next Steps

1. **Customize** the application for your specific needs
2. **Configure** email providers for production
3. **Set up** proper hosting (Vercel, Netlify, etc.)
4. **Configure** domain and SSL certificates
5. **Monitor** application performance and errors

---

## ✅ Success Indicators

Your setup is complete when you can:
- ✅ Run `npm run dev` without errors
- ✅ Access `http://localhost:3000` in your browser
- ✅ Register a new account or login
- ✅ Create a site and add rooms
- ✅ Add assets to rooms
- ✅ Run `npm run build` successfully

**Congratulations! Your Asset Management SaaS is now ready for use!** 🚀