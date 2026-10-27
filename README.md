# Full-Stack Blog Application (MERN)

A modern, production-ready Full-Stack Blog Application built with **React 19**, **Vite**, **Tailwind CSS**, **Zustand**, **Express 5**, and **MongoDB Atlas**. It supports role-based access control across **Readers/Users**, **Authors**, and **Administrators**, featuring JWT authentication via HTTP-only cookies and Bearer headers, image uploads via Cloudinary, and dedicated management dashboards.

---

## Table of Contents

- [Features](#features)
  - [Reader / User Features](#reader--user-features)
  - [Author Features](#author-features)
  - [Administrator Features](#administrator-features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Environment Variables](#environment-variables)
  - [Backend Configuration (`BACKEND/.env`)](#backend-configuration-backenedenv)
  - [Frontend Configuration (`Frontend/.env`)](#frontend-configuration-frontendenv)
- [Getting Started Locally](#getting-started-locally)
  - [Prerequisites](#prerequisites)
  - [Step 1: Clone Repository](#step-1-clone-repository)
  - [Step 2: Start the Backend](#step-2-start-the-backend)
  - [Step 3: Start the Frontend](#step-3-start-the-frontend)
- [REST API Reference](#rest-api-reference)
- [Deployment](#deployment)
  - [Option 1: Render Blueprint (Recommended)](#option-1-render-blueprint-recommended)
  - [Option 2: Manual Deployment](#option-2-manual-deployment)
- [License](#license)

---

## Features

### Reader / User Features
- **Public Feed**: Browse all active blog posts with categories, author tags, and publication timestamps.
- **Article Reading**: Read articles with a distraction-free responsive reading experience.
- **Interactive Discussions**: Authenticated users can participate in discussions and post comments.
- **Authentication**: Seamless sign-up and sign-in with role selection (`USER` or `AUTHOR`) and profile avatar upload.
- **User Profile**: View profile information and account status.
- **Security**: Protected routes with session auto-restoration across browser refreshes.

### Author Features
- **Author Studio (`/author-profile`)**: Dedicated management area for authors.
- **Publish Articles (`/author-profile/write-article`)**: Create articles with category tags, validation, and publication controls.
- **Manage Authored Articles (`/author-profile/articles`)**: View all published and inactive articles with status badges.
- **Edit Articles (`/edit-article/:id`)**: Full edit workflow with automatic data prefetching by route parameter.
- **Soft Delete & Restore**: Deactivate articles without losing data, and restore them anytime.

### Administrator Features
- **Admin Console (`/admin-profile`)**: Centralized administrative dashboard.
- **Platform Analytics**: Real-time counter metrics for total users, total authors, total articles, and active articles.
- **User Management**: View all registered users with emails, roles, joined dates, and one-click **Block / Unblock** controls.
- **Article Moderation**: Inspect all platform articles and one-click **Deactivate / Restore** moderation controls.

---

## Tech Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 19, Vite 7, Tailwind CSS v4, Zustand 5, React Router v7, React Hook Form, Lucide React, React Hot Toast, Axios |
| **Backend** | Node.js, Express 5, Mongoose 9, MongoDB Atlas, JSON Web Token (JWT), BcryptJS, Cookie-Parser, CORS |
| **Cloud Storage** | Cloudinary (User avatar uploads) & Multer (Memory storage & file validation) |
| **Deployment** | Render Blueprint (`render.yaml`), Vercel SPA Config (`vercel.json`) |

---

## Project Structure

```text
BLOG_APP/
├── BACKEND/
│   ├── APIs/
│   │   ├── AdminApi.js          # Admin stats, user blocking, article moderation
│   │   ├── AuthorApi.js         # Author registration, article CRUD & status
│   │   ├── CommonApi.js         # Authentication, logout, check-auth, password change
│   │   └── UserApi.js           # User registration, public articles, comments
│   ├── config/
│   │   ├── cloudinary.js        # Cloudinary SDK configuration
│   │   ├── cloudinaryUpload.js  # Buffer stream upload utility
│   │   └── multer.js            # Multer upload & file type validation
│   ├── middlewares/
│   │   ├── checkAuthor.js       # Author ownership & status middleware
│   │   └── verifyToken.js       # JWT authorization (cookies + Bearer header)
│   ├── models/
│   │   ├── ArticleModel.js      # Article & embedded comment schema
│   │   └── UserModel.js         # User, Author & Admin schema
│   ├── services/
│   │   └── authservice.js       # Password hashing & JWT generation
│   ├── .env                     # Backend environment secrets
│   ├── package.json
│   └── server.js                # Express app entry & database connection
├── Frontend/
│   ├── src/
│   │   ├── api/
│   │   │   └── axios.js         # Axios instance with baseURL & auth interceptor
│   │   ├── Components/
│   │   │   ├── AdminProfile.jsx # Admin dashboard (users & article moderation)
│   │   │   ├── ArticleById.jsx  # Article reader & discussion thread
│   │   │   ├── AuthorArticles.jsx # Author article portfolio
│   │   │   ├── AuthorProfile.jsx# Author layout & studio nav
│   │   │   ├── EditArticle.jsx  # Edit article form with URL-param fetch
│   │   │   ├── Header.jsx       # Global responsive navbar with user badge
│   │   │   ├── Home.jsx         # Public article grid
│   │   │   ├── Login.jsx        # Login form
│   │   │   ├── ProtectedRoute.jsx # Role-based route guard
│   │   │   ├── Register.jsx     # Registration with avatar upload
│   │   │   ├── RootLayout.jsx   # Root wrapper with session reload
│   │   │   └── WriteArticle.jsx # Create new article form
│   │   ├── stores/
│   │   │   └── authStore.js     # Zustand authentication store
│   │   ├── App.jsx              # Router configuration
│   │   └── main.jsx
│   ├── .env                     # Frontend environment variables
│   ├── package.json
│   ├── vercel.json              # Vercel SPA rewrites
│   └── vite.config.js
├── render.yaml                  # Automated full-stack Render blueprint
└── README.md
```

---

## Environment Variables

### Backend Configuration (`BACKEND/.env`)

Create a `.env` file in the `BACKEND` directory:

```env
PORT=3000
NODE_ENV=development
DB_URL=mongodb+srv://<username>:<password>@cluster.mongodb.net/blog-app?retryWrites=true&w=majority
JWT_SECRET=your_jwt_secret_key_here
CLOUD_NAME=your_cloudinary_cloud_name
API_KEY=your_cloudinary_api_key
API_SECRET=your_cloudinary_api_secret
FRONTEND_URL=http://localhost:5173
```

### Frontend Configuration (`Frontend/.env`)

Create a `.env` file in the `Frontend` directory:

```env
VITE_API_URL=http://localhost:3000
```

> **Note**: For production deployments, change `VITE_API_URL` to your live backend domain (e.g., `https://your-backend.onrender.com`).

---

## Getting Started Locally

### Prerequisites
- [Node.js](https://nodejs.org/) (v18.0.0 or higher)
- [MongoDB Atlas](https://www.mongodb.com/atlas) account or local MongoDB instance
- [Cloudinary](https://cloudinary.com/) account for image uploads

### Step 1: Clone Repository
```bash
git clone https://github.com/NSAITEJA38/CapstoneProject-1.git
cd CapstoneProject-1
```

### Step 2: Start the Backend
1. Navigate to the `BACKEND` folder:
   ```bash
   cd BACKEND
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up the `BACKEND/.env` file with your credentials.
4. Start the backend development server:
   ```bash
   npm run dev
   ```
   *The server runs on `http://localhost:3000`.*

### Step 3: Start the Frontend
1. Open a new terminal and navigate to the `Frontend` folder:
   ```bash
   cd Frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure `Frontend/.env` with `VITE_API_URL=http://localhost:3000`.
4. Start the frontend client:
   ```bash
   npm run dev
   ```
5. Open `http://localhost:5173` in your browser.

---

## REST API Reference

### Common Endpoints (`/common-api`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/common-api/authenticate` | Public | Log in with email & password; sets HTTP-only cookie and returns JWT |
| `GET` | `/common-api/logout` | Public | Clear auth cookie and end session |
| `GET` | `/common-api/check-auth` | Authenticated | Retrieve logged-in user profile from database |
| `PUT` | `/common-api/change-password` | Authenticated | Update user password |

### User Endpoints (`/user-api`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/user-api/users` | Public | Register as `USER` (supports multipart avatar upload) |
| `GET` | `/user-api/articles` | Public | Fetch all active articles sorted by creation date |
| `GET` | `/user-api/article/:id` | Public | Fetch single article by ID with author details & comments |
| `PUT` | `/user-api/articles` | Authenticated | Add a comment to an article |

### Author Endpoints (`/author-api`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/author-api/users` | Public | Register as `AUTHOR` (supports multipart avatar upload) |
| `POST` | `/author-api/articles` | `AUTHOR` | Create a new article |
| `GET` | `/author-api/articles/:authorId` | `AUTHOR` | Get all articles belonging to specific author |
| `PUT` | `/author-api/articles` | `AUTHOR` | Update authored article content & category |
| `PATCH` | `/author-api/articles/:id/status`| `AUTHOR` | Soft delete or restore authored article |

### Admin Endpoints (`/admin-api`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/admin-api/stats` | `ADMIN` | Fetch platform counter analytics |
| `GET` | `/admin-api/users` | `ADMIN` | List all registered users |
| `PATCH`| `/admin-api/users/:userId/status`| `ADMIN` | Block or unblock a user |
| `GET` | `/admin-api/articles` | `ADMIN` | List all articles across all statuses |
| `PATCH`| `/admin-api/articles/:articleId/status` | `ADMIN` | Deactivate or restore any article |

---

## Deployment

### Option 1: Render Blueprint (Recommended)

This repository includes a [`render.yaml`](./render.yaml) blueprint to automate full-stack deployment:

1. Log in to [Render Dashboard](https://dashboard.render.com).
2. Click **New +** -> **Blueprint**.
3. Connect repository `NSAITEJA38/CapstoneProject-1`.
4. Enter your environment secrets (`DB_URL`, `JWT_SECRET`, Cloudinary keys).
5. Click **Apply**. Render will automatically build the backend Web Service, build the frontend Static Site, and link both services.

### Option 2: Manual Deployment

- **Backend**: Deploy on Render or Railway as a **Web Service** (`rootDir: BACKEND`, build: `npm install`, start: `node server.js`).
- **Frontend**: Deploy on Render, Vercel, or Netlify as a **Static Site** (`rootDir: Frontend`, build: `npm run build`, publish: `dist`). Add SPA rewrite rule `/*` -> `/index.html`.

---

## License

This project is licensed under the ISC License.
