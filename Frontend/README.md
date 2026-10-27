# Blog Application - Frontend Client

A responsive single-page frontend application for the Blog Platform, built with **React 19**, **Vite**, **Tailwind CSS v4**, and **Zustand**.

---

## 🚀 Live Deployment Links

- **Live Application**: [https://blog-app-frontend-m1hy.onrender.com](https://blog-app-frontend-m1hy.onrender.com)
- **Connected Backend API**: [https://blog-app-backend-47sr.onrender.com](https://blog-app-backend-47sr.onrender.com)

## Features

- **Home Page**: Interactive responsive grid of published articles with category tags, author cards, and creation timestamps.
- **Article Reader & Discussion**: Full article view with formatted dates, author info, and discussion comment list with avatars.
- **Interactive Commenting**: Form for authenticated users to participate in discussions, plus guest invitation prompt.
- **Author Studio (`/author-profile`)**:
  - Author details and avatar badge.
  - Sub-route `articles`: Portfolio of all authored articles with active/deleted status pills and quick Read / Edit actions.
  - Sub-route `write-article`: Publishing form with category selection, live validation, and character limits.
- **Edit Article (`/edit-article/:id`)**: Edit title, category, and content with automatic fallback fetching by URL ID parameter.
- **Admin Console (`/admin-profile`)**:
  - Dashboard analytics cards for total users, authors, and articles.
  - User management table with one-click **Block / Unblock** action.
  - Article moderation table with one-click **Deactivate / Restore** action.
- **User Profile (`/user-profile`)**: Profile greeting, email, role badge, and account controls.
- **Authentication**:
  - Register with instant image preview, format validation, and multipart file upload.
  - Login with role-based redirection (`AUTHOR` -> Studio, `USER` -> Profile, `ADMIN` -> Console).
  - Session persistence: Reload hook restores full user credentials on page refresh.
- **Guarded Navigation**: `ProtectedRoute` component enforcing role authorization and preventing unauthorized access.

---

## Tech Stack

- **Framework**: React 19 (Hooks, Suspense-ready)
- **Bundler & Dev Server**: Vite 7
- **Styling**: Tailwind CSS v4 (`@tailwindcss/vite`)
- **State Management**: Zustand 5
- **Routing**: React Router v7 (`createBrowserRouter`, `RouterProvider`, nested routes)
- **Forms & Validation**: React Hook Form
- **HTTP Client**: Axios with Bearer token interceptor and `withCredentials: true`
- **Icons & Alerts**: Lucide React & React Hot Toast

---

## Directory Structure

```text
Frontend/
├── public/
│   └── vite.svg
├── src/
│   ├── api/
│   │   └── axios.js           # Preconfigured Axios instance with token interceptor
│   ├── Components/
│   │   ├── AdminDashboard.jsx # Dashboard stub component
│   │   ├── AdminProfile.jsx   # Full Admin dashboard (users & articles moderation)
│   │   ├── ArticleById.jsx    # Article detail & discussion thread
│   │   ├── AuthorArticles.jsx # Author article cards list
│   │   ├── AuthorProfile.jsx  # Author studio layout & sub-navigation
│   │   ├── EditArticle.jsx    # Edit article form with URL-param fetch
│   │   ├── Footer.jsx         # Global footer
│   │   ├── Header.jsx         # Global navbar with role badges and profile links
│   │   ├── Home.jsx           # Public article grid
│   │   ├── Login.jsx          # User & author login
│   │   ├── Logout.jsx         # Secure logout page
│   │   ├── ProtectedRoute.jsx # Role-based route guard
│   │   ├── Register.jsx       # Multi-role registration with avatar upload
│   │   ├── RootLayout.jsx     # Root layout wrapping Header, Outlet, Footer
│   │   ├── Unauthorised.jsx   # 403 Forbidden page
│   │   ├── UserProfile.jsx    # User profile overview
│   │   └── WriteArticle.jsx   # Article publication form
│   ├── stores/
│   │   └── authStore.js       # Zustand auth store (login, logout, reload)
│   ├── styles/
│   │   └── common.js          # Reusable typography and design tokens
│   ├── App.css
│   ├── App.jsx                # Router route definitions
│   ├── index.css              # Global styles & Tailwind import
│   └── main.jsx               # React DOM entry
├── .env                       # Environment variables
├── eslint.config.js           # ESLint configuration
├── package.json
├── vercel.json                # Vercel SPA rewrites
└── vite.config.js             # Vite configuration with React and Tailwind plugins
```

---

## Environment Variables (`.env`)

Create a `.env` file in the `Frontend` folder:

```env
VITE_API_URL=http://localhost:3000
```

> **For Production**: Set `VITE_API_URL` to your hosted backend URL (e.g. `https://your-backend.onrender.com`).

---

## Getting Started

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start development server**:
   ```bash
   npm run dev
   ```

3. **Run linter**:
   ```bash
   npm run lint
   ```

4. **Build for production**:
   ```bash
   npm run build
   ```

5. **Preview production build**:
   ```bash
   npm run preview
   ```