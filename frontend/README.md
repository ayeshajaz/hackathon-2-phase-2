# Task Manager - Frontend

A modern task management web application built with Next.js 16+, React 19+, and TypeScript.

## Features

- **User Authentication**: Secure signup, signin, and signout with JWT tokens
- **Task Management**: Create, read, update, delete, and complete tasks
- **Responsive Design**: Works seamlessly on mobile (320px+), tablet, and desktop devices
- **Real-time Updates**: Optimistic UI updates for instant feedback
- **Error Handling**: Comprehensive error handling with user-friendly messages
- **Accessibility**: WCAG-compliant with keyboard navigation and screen reader support

## Tech Stack

- **Framework**: Next.js 16.1.6 (App Router)
- **UI Library**: React 19.2.3
- **Language**: TypeScript 5.x
- **Styling**: Tailwind CSS 4.x
- **State Management**: TanStack Query (React Query)
- **Form Handling**: React Hook Form
- **Authentication**: Better Auth (client-side)

## Prerequisites

- Node.js 20+ and npm
- Backend API running on `http://localhost:8000` (or configured via environment variable)

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Create a `.env.local` file in the frontend directory:

```bash
cp .env.local.example .env.local
```

Edit `.env.local` and set your backend API URL:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### 3. Run Development Server

```bash
npm run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000)

### 4. Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
frontend/
├── app/                      # Next.js App Router
│   ├── (auth)/              # Authentication pages (signin, signup)
│   ├── (protected)/         # Protected pages (dashboard)
│   ├── layout.tsx           # Root layout with providers
│   ├── page.tsx             # Landing page with redirects
│   ├── providers.tsx        # React Query and Auth providers
│   └── globals.css          # Global styles
├── components/              # React components
│   ├── auth/               # Authentication components
│   ├── tasks/              # Task management components
│   ├── ui/                 # Reusable UI components
│   └── layout/             # Layout components
├── lib/                     # Utility libraries
│   ├── api/                # API client and endpoints
│   ├── auth/               # Authentication utilities
│   └── utils/              # Helper functions
├── types/                   # TypeScript type definitions
├── hooks/                   # Custom React hooks
└── public/                  # Static assets
```

## Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## Features Overview

### Authentication

- **Signup**: Create a new account with email and password (8+ characters)
- **Signin**: Authenticate with existing credentials
- **Signout**: Clear session and redirect to signin
- **Protected Routes**: Automatic redirect to signin for unauthenticated users
- **Session Persistence**: JWT token stored in localStorage for 24-hour sessions

### Task Management

- **View Tasks**: Display all tasks with completion status
- **Create Tasks**: Add new tasks with title (required) and description (optional)
- **Edit Tasks**: Update task details with inline editing
- **Complete Tasks**: Toggle completion status with visual feedback
- **Delete Tasks**: Remove tasks with confirmation dialog
- **Empty State**: Helpful message when no tasks exist
- **Loading States**: Spinner indicators during API calls
- **Error Handling**: User-friendly error messages with retry options

### Responsive Design

- **Mobile First**: Optimized for 320px+ screens
- **Touch Friendly**: 44px minimum tap targets on mobile
- **Adaptive Layout**: Responsive breakpoints at 640px (sm), 768px (md), 1024px (lg)
- **Flexible Forms**: Full-width on mobile, optimized spacing on desktop
- **Readable Text**: Appropriate font sizes for all screen sizes

## API Integration

The frontend communicates with the backend API using the following endpoints:

### Authentication Endpoints

- `POST /api/auth/signup` - Create new user account
- `POST /api/auth/signin` - Authenticate user
- `GET /api/auth/me` - Get current user information

### Task Endpoints

- `GET /api/tasks` - List all tasks for authenticated user
- `POST /api/tasks` - Create a new task
- `GET /api/tasks/{id}` - Get a specific task
- `PUT /api/tasks/{id}` - Update a task
- `PATCH /api/tasks/{id}/complete` - Toggle task completion
- `DELETE /api/tasks/{id}` - Delete a task

All protected endpoints require a JWT token in the `Authorization: Bearer <token>` header.

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | Backend API base URL | `http://localhost:8000` |

## Browser Support

- Chrome (last 2 versions)
- Firefox (last 2 versions)
- Safari (last 2 versions)
- Edge (last 2 versions)

## Accessibility

- Semantic HTML elements
- ARIA labels on interactive elements
- Keyboard navigation support (Tab, Enter, Escape)
- Focus indicators on all interactive elements
- Screen reader compatible
- Sufficient color contrast (WCAG AA)

## Security

- JWT tokens stored in localStorage
- Automatic token injection in API requests
- Protected routes with authentication checks
- XSS protection via Content Security Policy headers
- Input validation on all forms
- No sensitive data in client-side code

## Performance

- Code splitting with Next.js App Router
- Optimized images with next/image
- React Query caching for API responses
- Minimal re-renders with optimistic updates
- Fast page loads (<2s initial load)

## Troubleshooting

### Cannot connect to backend

- Verify backend is running on the configured URL
- Check `NEXT_PUBLIC_API_URL` in `.env.local`
- Ensure CORS is configured on the backend

### Authentication not working

- Clear localStorage and try again
- Check browser console for errors
- Verify JWT token is being sent in requests

### Build errors

- Delete `.next` folder and `node_modules`
- Run `npm install` again
- Check for TypeScript errors with `npm run build`

## Contributing

This project follows the Spec-Driven Development (SDD) methodology. All changes should:

1. Be documented in a specification
2. Follow the existing code structure
3. Include proper TypeScript types
4. Maintain responsive design
5. Preserve accessibility features

## License

This project is part of a hackathon submission.

## Support

For issues or questions, please refer to the project documentation in the `specs/` directory.
