# Quickstart Guide: Frontend & Integration

**Feature**: 003-frontend-integration
**Date**: 2026-02-10
**Purpose**: Setup and development guide for the Next.js frontend application

---

## Prerequisites

Before starting, ensure you have the following installed:

- **Node.js**: Version 20.x or higher
- **npm**: Version 10.x or higher (comes with Node.js)
- **Git**: For version control
- **Backend API**: The FastAPI backend from Spec-1 and Spec-2 must be running

**Check versions:**
```bash
node --version    # Should be v20.x or higher
npm --version     # Should be v10.x or higher
```

---

## Project Setup

### 1. Create Next.js Project

Initialize a new Next.js 16+ project with TypeScript and Tailwind CSS:

```bash
# Navigate to project root
cd hackathon-2-phase-2

# Create Next.js app with TypeScript and Tailwind
npx create-next-app@latest frontend --typescript --tailwind --app --no-src-dir --import-alias "@/*"

# Navigate to frontend directory
cd frontend
```

**Options explained:**
- `--typescript`: Enable TypeScript
- `--tailwind`: Include Tailwind CSS
- `--app`: Use App Router (not Pages Router)
- `--no-src-dir`: Place app/ at root level
- `--import-alias "@/*"`: Enable path aliases

---

### 2. Install Dependencies

Install required packages for authentication, API state management, and forms:

```bash
npm install @tanstack/react-query react-hook-form better-auth
```

**Dependencies:**
- `@tanstack/react-query`: Server state management (caching, refetching)
- `react-hook-form`: Form state management and validation
- `better-auth`: Authentication client library

---

### 3. Configure Environment Variables

Create `.env.local` file in the `frontend/` directory:

```bash
# Copy example file
cp .env.local.example .env.local
```

**Edit `.env.local`:**
```bash
# Backend API base URL
NEXT_PUBLIC_API_URL=http://localhost:8000

# Optional: Enable debug logging
NEXT_PUBLIC_DEBUG=false
```

**Important:**
- `NEXT_PUBLIC_` prefix makes variables available in the browser
- Never commit `.env.local` to version control (already in .gitignore)
- Update `NEXT_PUBLIC_API_URL` if backend runs on different port

---

### 4. Create Project Structure

Create the directory structure as defined in plan.md:

```bash
# Create directories
mkdir -p app/{auth,protected}/signin
mkdir -p app/{auth,protected}/signup
mkdir -p app/protected/dashboard
mkdir -p components/{auth,tasks,ui,layout}
mkdir -p lib/{api,auth,utils}
mkdir -p types
mkdir -p hooks
```

**Verify structure:**
```bash
tree -L 2 -d
# Should show app/, components/, lib/, types/, hooks/
```

---

## Development Workflow

### 1. Start Backend API

Before starting the frontend, ensure the backend is running:

```bash
# In a separate terminal, navigate to backend directory
cd ../backend

# Activate virtual environment (if using)
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Start backend server
uvicorn src.main:app --reload --port 8000
```

**Verify backend is running:**
```bash
curl http://localhost:8000/
# Should return: {"message":"Task Management API","status":"running",...}
```

---

### 2. Start Frontend Development Server

```bash
# In frontend directory
npm run dev
```

**Output:**
```
▲ Next.js 16.x
- Local:        http://localhost:3000
- Network:      http://192.168.x.x:3000

✓ Ready in 2.3s
```

**Access the application:**
- Open browser to http://localhost:3000
- Hot reload is enabled (changes auto-refresh)

---

### 3. Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server (after build)
npm start

# Run TypeScript type checking
npm run type-check

# Lint code
npm run lint

# Format code (if prettier configured)
npm run format
```

---

## Project Structure Overview

```
frontend/
├── app/                      # Next.js App Router
│   ├── (auth)/              # Unauthenticated pages
│   │   ├── signin/page.tsx
│   │   └── signup/page.tsx
│   ├── (protected)/         # Authenticated pages
│   │   ├── dashboard/page.tsx
│   │   └── layout.tsx       # Auth check wrapper
│   ├── layout.tsx           # Root layout
│   ├── page.tsx             # Landing page
│   └── globals.css          # Global styles
├── components/              # Reusable components
│   ├── auth/               # Auth forms and buttons
│   ├── tasks/              # Task CRUD components
│   ├── ui/                 # Generic UI components
│   └── layout/             # Layout components
├── lib/                     # Business logic
│   ├── api/                # API client and calls
│   ├── auth/               # Auth utilities
│   └── utils/              # Helper functions
├── types/                   # TypeScript types
├── hooks/                   # Custom React hooks
├── public/                  # Static assets
├── .env.local              # Environment variables (gitignored)
├── .env.local.example      # Environment template
├── next.config.js          # Next.js configuration
├── tailwind.config.js      # Tailwind configuration
├── tsconfig.json           # TypeScript configuration
└── package.json            # Dependencies
```

---

## Configuration Files

### next.config.js

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Add any custom configuration here
};

module.exports = nextConfig;
```

---

### tailwind.config.js

```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      // Add custom theme extensions here
    },
  },
  plugins: [],
};
```

---

### tsconfig.json

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

---

## Testing the Application

### Manual Testing Checklist

**Authentication Flow:**
1. Navigate to http://localhost:3000
2. Click "Sign Up" and create a new account
3. Verify redirect to dashboard after signup
4. Sign out and verify redirect to signin page
5. Sign in with created account
6. Verify redirect to dashboard

**Task Management:**
1. Create a new task with title and description
2. Verify task appears in the list
3. Edit the task and verify changes
4. Mark task as complete and verify visual change
5. Delete task with confirmation and verify removal

**Responsive Design:**
1. Resize browser window to mobile width (320px)
2. Verify layout adapts and remains usable
3. Test on tablet width (768px)
4. Test on desktop width (1280px)

**Error Handling:**
1. Try to sign up with existing email (expect 409 error)
2. Try to sign in with wrong password (expect 401 error)
3. Stop backend server and try to create task (expect error message)
4. Verify error messages are clear and helpful

---

## Troubleshooting

### Port Already in Use

**Error:** `Port 3000 is already in use`

**Solution:**
```bash
# Find process using port 3000
lsof -i :3000  # On macOS/Linux
netstat -ano | findstr :3000  # On Windows

# Kill the process or use different port
npm run dev -- -p 3001
```

---

### Backend Connection Refused

**Error:** `Failed to fetch` or `Network error`

**Solution:**
1. Verify backend is running: `curl http://localhost:8000/`
2. Check `NEXT_PUBLIC_API_URL` in `.env.local`
3. Ensure no CORS issues (backend should allow frontend origin)

---

### TypeScript Errors

**Error:** Type errors during development

**Solution:**
```bash
# Run type checking
npm run type-check

# Check for missing type definitions
npm install --save-dev @types/node @types/react @types/react-dom
```

---

### Module Not Found

**Error:** `Cannot find module '@/...'`

**Solution:**
1. Verify `tsconfig.json` has correct path aliases
2. Restart development server: `npm run dev`
3. Clear Next.js cache: `rm -rf .next`

---

## Production Deployment

### Build for Production

```bash
# Create optimized production build
npm run build

# Test production build locally
npm start
```

**Build output:**
```
Route (app)                              Size     First Load JS
┌ ○ /                                    1.2 kB         85.3 kB
├ ○ /(auth)/signin                       2.5 kB         87.6 kB
├ ○ /(auth)/signup                       2.5 kB         87.6 kB
└ ○ /(protected)/dashboard               3.8 kB         88.9 kB
```

---

### Environment Variables for Production

Create `.env.production` for production environment:

```bash
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
```

**Important:**
- Use HTTPS in production
- Update API URL to production backend
- Never expose secrets in `NEXT_PUBLIC_` variables

---

### Deployment Platforms

**Vercel (Recommended for Next.js):**
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel
```

**Netlify:**
```bash
# Build command: npm run build
# Publish directory: .next
```

**Docker:**
```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

---

## Additional Resources

- **Next.js Documentation**: https://nextjs.org/docs
- **React Documentation**: https://react.dev
- **Tailwind CSS**: https://tailwindcss.com/docs
- **TanStack Query**: https://tanstack.com/query/latest
- **React Hook Form**: https://react-hook-form.com
- **Better Auth**: https://www.better-auth.com

---

## Getting Help

**Common Issues:**
1. Check backend is running and accessible
2. Verify environment variables are set correctly
3. Clear Next.js cache: `rm -rf .next`
4. Reinstall dependencies: `rm -rf node_modules && npm install`

**For Development Questions:**
- Review spec.md for requirements
- Check plan.md for architecture decisions
- See data-model.md for TypeScript types
- Reference contracts/api-types.ts for API contracts

---

**Quickstart Status**: ✅ Complete
**Next**: Update agent context and proceed to task generation
