# En-Passant Frontend

This repository contains the frontend web application for the En-Passant official website. Built with Next.js 16 (App Router), Tailwind CSS, Shadcn UI, Clerk authentication, and various animation libraries (Framer Motion, GSAP, React Three Fiber).

## Features & Routing

| Feature         | Route               | Description                                                          |
| --------------- | ------------------- | -------------------------------------------------------------------- |
| **Auth**        | `/auth/*`           | Clerk-managed sign-in and sign-up flows                              |
| **Recruitment** | `/apply` & `/tasks` | Application workflow, task selection, and file submission            |
| **Admin**       | `/admin`            | Administrative dashboard for managing users, applications, and tasks |
| **Leaderboard** | `/leaderboard`      | Global chess rankings fetched from the backend                       |
| **Events**      | `/event-gallery`    | Public viewing of upcoming and past club events                      |
| **Profile**     | `/profile`          | User account settings and integrations                               |
| **Contact**     | `/contact`          | Public contact and inquiry form                                      |

## Prerequisites

Before setting up the project, ensure you have the following installed on your machine:

- Node.js (v18 or higher recommended)
- The [En-Passant Backend](https://github.com/EnPassant-Chess-Forum-ABESEC/En-Passant-Backend) running locally

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **UI & Styling:** Tailwind CSS, Shadcn UI
- **Animations:** Framer Motion, GSAP, React Three Fiber
- **Authentication:** Clerk
- **Forms & Validation:** React Hook Form, Zod

## Local Setup Instructions

1. **Clone the repository:**

   ```bash
   git clone https://github.com/EnPassant-Chess-Forum-ABESEC/en-passant-frontend-v1.git
   cd en-passant-frontend-v1
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Copy the provided `.env.example` (or use the template below) to create your local `.env.local` file.

   ```env
   # Clerk Auth
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
   CLERK_SECRET_KEY=sk_test_...
   NEXT_PUBLIC_CLERK_SIGN_IN_URL=/auth/sign-in
   NEXT_PUBLIC_CLERK_SIGN_UP_URL=/auth/sign-up

   # Backend API
   NEXT_PUBLIC_API_URL=http://localhost:8080/api

   # Payments
   NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_...
   ```

4. **Start the Development Server:**

   ```bash
   npm run dev
   ```

   The application should now be running on [http://localhost:3000](http://localhost:3000).

## Architecture & Project Structure

This project uses the Next.js **App Router** (`src/app`). It's important to understand the separation between Server Components (default) and Client Components (using `"use client"`).

- **`src/app/`**: Contains all routes, layouts, and pages. By default, pages here are **Server Components**.
- **`src/components/`**: Reusable UI components. Components that require interactivity (like hooks, Framer Motion, or 3D canvas) must declare `"use client"` at the top.
- **`src/lib/`**: Contains utility functions (like the Tailwind `cn()` merger), API helpers, and constants.

## Development Guidelines

### 1. UI & Styling
- **Tailwind CSS:** Use utility classes for almost all styling.
- **Shadcn UI:** Before building a custom accessible component (like a Modal or Select), check if a Shadcn component already exists in `src/components/ui`.
- **Dynamic Classes:** Use `cn()` from `src/lib/utils.js` to conditionally merge Tailwind classes safely (powered by `clsx` and `tailwind-merge`).

### 2. State & Data Fetching
- **Authentication:** Clerk manages all user sessions. Use `useUser()` or `useAuth()` in Client Components, and `auth()` in Server Components.
- **API Calls:** When making `fetch` requests to the Node.js backend (`NEXT_PUBLIC_API_URL`), ensure you attach the Clerk JWT token if the endpoint is protected.

### 3. Animations & 3D Graphics
- **Standard UI Transitions:** Use **Framer Motion** (`framer-motion`) for page transitions, modals popping in, or hover effects.
- **Complex Scroll/Hero Animations:** Use **GSAP** if coordinating complex, timeline-based scroll animations.
- **3D Canvas:** Use **React Three Fiber** and **Drei** for any WebGL/3D elements. Remember that the `<Canvas>` component must be in a `"use client"` boundary.

## Contribution Flow

1. **Branching:** Create a new branch for your feature or fix (e.g., `feat/add-profile-editor` or `fix/button-alignment`).
2. **Commit Messages:** Write clear, concise commit messages.
3. **Pull Requests:** Open a PR against the `main` branch. Ensure your code passes linting (`npm run lint`) and doesn't break existing animations or responsive layouts.
