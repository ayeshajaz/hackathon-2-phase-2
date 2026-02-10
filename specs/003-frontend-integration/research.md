# Research: Frontend & Integration Technology Decisions

**Feature**: 003-frontend-integration
**Date**: 2026-02-10
**Purpose**: Document all technology choices and architectural decisions for the Next.js frontend

---

## 1. Next.js App Router Architecture

### Decision
Use Next.js 16+ App Router with route groups for organizing authenticated and unauthenticated pages.

### Rationale
- **App Router is the modern standard**: Next.js 13+ introduced App Router as the recommended approach, with better performance and developer experience
- **Route groups enable clean organization**: Using `(auth)` and `(protected)` route groups allows logical separation without affecting URL structure
- **Server Components by default**: App Router uses Server Components by default, with Client Components opt-in via 'use client' directive
- **Better data fetching**: Built-in support for async Server Components and streaming

### Alternatives Considered
- **Pages Router**: Older Next.js routing system, still supported but not recommended for new projects
- **Flat route structure**: Would mix authenticated and unauthenticated pages without clear separation

### Trade-offs
- ✅ Pros: Modern, performant, better DX, future-proof
- ❌ Cons: Newer API with less Stack Overflow content, requires understanding Server vs Client Components

### Implementation Notes
- Use route groups: `app/(auth)/signin` and `app/(protected)/dashboard`
- Protected routes will have a layout that checks authentication
- Server Components for static content, Client Components for interactive UI

---

## 2. Better Auth Integration

### Decision
Use Better Auth client library for authentication state management, with JWT tokens stored and managed on the frontend.

### Rationale
- **Spec requirement**: Better Auth is specified in the project constitution
- **JWT-based**: Aligns with backend JWT authentication (Spec-2)
- **Client-side focus**: Better Auth provides client-side utilities for managing auth state
- **Token management**: Handles token storage, refresh, and expiration

### Alternatives Considered
- **NextAuth.js**: Popular auth library for Next.js, but not specified in requirements
- **Custom auth implementation**: More control but more complexity and security risks

### Trade-offs
- ✅ Pros: Spec-compliant, designed for JWT workflows, handles token lifecycle
- ❌ Cons: Less documentation than NextAuth.js, need to ensure proper integration

### Implementation Notes
- Install Better Auth client package
- Configure with backend API endpoints
- Use Better Auth hooks for auth state (useAuth, useSession)
- Integrate with React Context for app-wide auth state

---

## 3. JWT Storage Strategy

### Decision
Use **localStorage** for JWT token storage with XSS mitigation strategies.

### Rationale
- **Simplicity**: localStorage is straightforward to implement and works across all browsers
- **No server required**: Frontend is stateless, no server-side session management
- **Better Auth compatibility**: Better Auth supports localStorage out of the box
- **Acceptable risk**: For a hackathon project with proper XSS protections (CSP headers, input sanitization)

### Alternatives Considered
- **httpOnly cookies**: Most secure option, but requires server-side rendering or API proxy
- **sessionStorage**: Cleared on tab close, poor UX for users
- **In-memory only**: Lost on page refresh, poor UX

### Trade-offs
- ✅ Pros: Simple, works with static hosting, persists across sessions
- ❌ Cons: Vulnerable to XSS attacks if not properly protected

### Security Mitigations
- Implement Content Security Policy (CSP) headers
- Sanitize all user input to prevent XSS
- Clear token on signout
- Validate token expiration on every request
- Use HTTPS only in production

### Implementation Notes
```typescript
// lib/auth/token.ts
export const setToken = (token: string) => localStorage.setItem('jwt_token', token);
export const getToken = () => localStorage.getItem('jwt_token');
export const clearToken = () => localStorage.removeItem('jwt_token');
```

---

## 4. API Client Architecture

### Decision
Use **native Fetch API** with a custom wrapper for JWT injection and error handling, combined with **TanStack Query** for server state management.

### Rationale
- **Fetch is built-in**: No additional dependencies, works in all modern browsers
- **TanStack Query for caching**: Handles caching, refetching, and optimistic updates
- **Separation of concerns**: Fetch wrapper handles HTTP, TanStack Query handles state
- **Type safety**: Easy to type with TypeScript

### Alternatives Considered
- **Axios**: Popular HTTP client, but adds dependency and Fetch is sufficient
- **SWR**: Alternative to TanStack Query, but TanStack Query has better TypeScript support
- **Fetch only**: Would require manual caching and state management

### Trade-offs
- ✅ Pros: No extra HTTP client dependency, excellent caching with TanStack Query, great TypeScript support
- ❌ Cons: Need to implement retry logic manually, Fetch API is more verbose than Axios

### Implementation Notes
```typescript
// lib/api/client.ts
export async function apiClient(endpoint: string, options?: RequestInit) {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options?.headers,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.status}`);
  }

  return response.json();
}
```

---

## 5. State Management

### Decision
Use **React Context** for auth state and **TanStack Query** for server state (API data). No global state management library needed.

### Rationale
- **React Context is sufficient**: Auth state is simple (user, token, loading, error)
- **TanStack Query handles server state**: Caching, refetching, mutations for API data
- **Avoid over-engineering**: No need for Redux/Zustand for this scope
- **Component-level state**: UI state (modals, forms) managed with useState

### Alternatives Considered
- **Zustand**: Lightweight state management, but unnecessary for this scope
- **Redux**: Too heavy for this project, adds complexity
- **Jotai/Recoil**: Atomic state management, overkill for simple auth state

### Trade-offs
- ✅ Pros: Simple, no extra dependencies, React built-in, sufficient for requirements
- ❌ Cons: Context can cause re-renders if not optimized (use useMemo for context value)

### Implementation Notes
```typescript
// lib/auth/context.tsx
export const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Auth logic here

  const value = useMemo(() => ({ user, loading, signin, signup, signout }), [user, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
```

---

## 6. Form Handling

### Decision
Use **React Hook Form** for form state management and validation.

### Rationale
- **Best-in-class performance**: Minimizes re-renders with uncontrolled components
- **Built-in validation**: Supports schema validation with Zod or Yup
- **Great TypeScript support**: Fully typed form state
- **Small bundle size**: ~9KB gzipped

### Alternatives Considered
- **Formik**: Popular but heavier and more re-renders
- **Native React state**: Too much boilerplate for forms with validation
- **Uncontrolled forms**: Simple but harder to validate and manage

### Trade-offs
- ✅ Pros: Excellent performance, great DX, minimal re-renders, built-in validation
- ❌ Cons: Learning curve for uncontrolled component pattern

### Implementation Notes
```typescript
// components/auth/SigninForm.tsx
import { useForm } from 'react-hook-form';

export function SigninForm() {
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    // Handle signin
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('email', { required: true })} />
      {errors.email && <span>Email is required</span>}
    </form>
  );
}
```

---

## 7. UI Component Strategy

### Decision
Use **Tailwind CSS** for styling with **custom components** (no pre-built component library).

### Rationale
- **Tailwind is utility-first**: Fast development, consistent design system
- **Custom components for control**: Full control over markup and behavior
- **No component library bloat**: shadcn/ui is great but adds complexity for simple UI
- **Responsive by default**: Tailwind breakpoints make responsive design easy

### Alternatives Considered
- **shadcn/ui**: Excellent component library, but overkill for this scope
- **Material-UI**: Too opinionated, large bundle size
- **Plain CSS**: Too much boilerplate, harder to maintain

### Trade-offs
- ✅ Pros: Fast development, small bundle, full control, responsive utilities
- ❌ Cons: Need to build all components from scratch (but scope is small)

### Implementation Notes
- Install Tailwind CSS with Next.js
- Create reusable components: Button, Input, Card, LoadingSpinner, ErrorMessage
- Use Tailwind responsive breakpoints: `sm:`, `md:`, `lg:`, `xl:`
- Example: `<button className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded">`

---

## 8. Loading and Error States

### Decision
Use **React Suspense** for loading states and **Error Boundaries** for error handling, with manual loading states for mutations.

### Rationale
- **Suspense for data fetching**: Works well with TanStack Query and async Server Components
- **Error Boundaries for errors**: Catch and display errors at component boundaries
- **Manual states for mutations**: Forms and mutations need explicit loading/error states
- **Better UX**: Clear feedback for all async operations

### Alternatives Considered
- **Manual loading states everywhere**: Too much boilerplate
- **Global loading indicator**: Poor UX, doesn't show what's loading
- **No error handling**: Terrible UX, app crashes on errors

### Trade-offs
- ✅ Pros: Clean code, automatic loading states, graceful error handling
- ❌ Cons: Need to set up Error Boundaries, Suspense requires understanding

### Implementation Notes
```typescript
// app/(protected)/dashboard/page.tsx
export default function DashboardPage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <TaskList />
    </Suspense>
  );
}

// components/ErrorBoundary.tsx
class ErrorBoundary extends React.Component {
  state = { hasError: false };

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return <ErrorMessage message="Something went wrong" />;
    }
    return this.props.children;
  }
}
```

---

## Summary of Technology Stack

| Category | Technology | Rationale |
|----------|-----------|-----------|
| Framework | Next.js 16+ App Router | Modern, performant, spec-compliant |
| Language | TypeScript 5.3+ | Type safety, better DX |
| Auth | Better Auth + JWT | Spec requirement, JWT-based |
| Token Storage | localStorage | Simple, works with static hosting |
| HTTP Client | Fetch API | Built-in, no extra dependency |
| Server State | TanStack Query | Caching, refetching, mutations |
| Client State | React Context | Sufficient for auth state |
| Forms | React Hook Form | Performance, validation, DX |
| Styling | Tailwind CSS | Utility-first, responsive |
| Components | Custom | Full control, no bloat |
| Loading | React Suspense | Automatic, clean |
| Errors | Error Boundaries | Graceful handling |

---

## Architectural Decision Records (ADRs)

### ADR Candidates Identified

1. **ADR-001: JWT Storage in localStorage vs httpOnly Cookies**
   - Decision: localStorage
   - Rationale: Simplicity, static hosting, Better Auth compatibility
   - Trade-off: Security risk mitigated with CSP and XSS protections

2. **ADR-002: TanStack Query vs SWR for Server State**
   - Decision: TanStack Query
   - Rationale: Better TypeScript support, more features, larger community
   - Trade-off: Slightly larger bundle than SWR

3. **ADR-003: Custom Components vs shadcn/ui**
   - Decision: Custom components
   - Rationale: Full control, smaller bundle, sufficient for scope
   - Trade-off: More development time, but scope is manageable

**Recommendation**: Document ADR-001 (JWT storage) as it has security implications. ADR-002 and ADR-003 are less critical.

---

**Research Status**: ✅ Complete
**Next Phase**: Generate data-model.md, contracts/, and quickstart.md
