# Blog Application - Backend API

The backend for the Blog Application is an Express.js REST API using MongoDB (Mongoose) for persistence, JSON Web Tokens (JWT) for authentication with HTTP-only cookies and Bearer headers, and Cloudinary with Multer for profile image uploads.

---

## 🚀 Live Deployment Links

- **Live REST API**: [https://blog-app-backend-47sr.onrender.com](https://blog-app-backend-47sr.onrender.com)
- **Live Frontend**: [https://blog-app-frontend-m1hy.onrender.com](https://blog-app-frontend-m1hy.onrender.com)

## Architecture & Features

- **Express 5**: Fast, modular REST API.
- **MongoDB Atlas & Mongoose**: Schemas for Users, Authors, Admins, and Articles with embedded comments.
- **Role-Based Access Control**: Strict role checking across `USER`, `AUTHOR`, and `ADMIN`.
- **Authentication**: Bcrypt password hashing, JWT cookies + Bearer auth headers, session refresh verification from the database.
- **Cloudinary & Multer**: Multipart form-data handling with memory storage, image mime-type validation, and size limits (2MB).
- **Security & Error Handling**: Dynamic CORS configuration, environment-aware cookies (`secure` and `sameSite`), and centralized JSON error responses.

---

## Directory Structure

```text
BACKEND/
├── APIs/
│   ├── AdminApi.js          # Admin endpoints: stats, user status, article moderation
│   ├── AuthorApi.js         # Author endpoints: registration, article CRUD, soft delete
│   ├── CommonApi.js         # Common auth endpoints: authenticate, logout, check-auth, password
│   └── UserApi.js           # User endpoints: registration, public articles, comments
├── config/
│   ├── cloudinary.js        # Cloudinary SDK credentials
│   ├── cloudinaryUpload.js  # Stream upload buffer utility
│   └── multer.js            # Memory storage & filter configuration
├── middlewares/
│   ├── checkAuthor.js       # Verifies author identity and account active status
│   └── verifyToken.js       # Verifies JWT token from cookies or Authorization header
├── models/
│   ├── ArticleModel.js      # Article schema with embedded userCommentSchema
│   └── UserModel.js         # UserTypeModel schema with roles (USER, AUTHOR, ADMIN)
├── services/
│   └── authservice.js       # Registration duplicate checking, hashing, and authentication
├── .env                     # Environment variables
├── package.json
└── server.js                # Express app initialization & MongoDB connection
```

---

## Environment Variables (`.env`)

```env
PORT=3000
NODE_ENV=development
DB_URL=mongodb+srv://<username>:<password>@cluster.mongodb.net/blog-app?retryWrites=true&w=majority
JWT_SECRET=your_jwt_secret_key
CLOUD_NAME=your_cloudinary_cloud_name
API_KEY=your_cloudinary_api_key
API_SECRET=your_cloudinary_api_secret
FRONTEND_URL=http://localhost:5173
```

---

## Getting Started

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Configure Environment Variables**:
   Create a `.env` file based on the example above.

3. **Start Development Server**:
   ```bash
   npm run dev
   ```

4. **Production Start**:
   ```bash
   npm start
   ```

---

## API Endpoints

### 1. Common API (`/common-api`)

#### Authenticate / Login
- **Method**: `POST`
- **URL**: `/common-api/authenticate`
- **Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "Password123"
  }
  ```
- **Response** (`200 OK`):
  Sets HTTP-only `token` cookie and returns:
  ```json
  {
    "message": "login success",
    "payload": {
      "_id": "64f1...",
      "firstName": "John",
      "lastName": "Doe",
      "email": "user@example.com",
      "role": "USER",
      "profileImageUrl": "https://res.cloudinary.com/..."
    },
    "token": "eyJhbGciOi..."
  }
  ```

#### Logout
- **Method**: `GET`
- **URL**: `/common-api/logout`
- **Response** (`200 OK`): Clears `token` cookie.

#### Check Authentication (Session Reload)
- **Method**: `GET`
- **URL**: `/common-api/check-auth`
- **Headers**: Cookie `token` or `Authorization: Bearer <token>`
- **Response** (`200 OK`):
  ```json
  {
    "message": "authenticated",
    "payload": {
      "_id": "64f1...",
      "firstName": "John",
      "lastName": "Doe",
      "email": "user@example.com",
      "role": "USER",
      "profileImageUrl": "https://..."
    }
  }
  ```

#### Change Password
- **Method**: `PUT`
- **URL**: `/common-api/change-password`
- **Headers**: `Authorization: Bearer <token>` or Cookie
- **Body**:
  ```json
  {
    "currentPassword": "OldPassword123",
    "newPassword": "NewPassword456"
  }
  ```

---

### 2. User API (`/user-api`)

#### Register User
- **Method**: `POST`
- **URL**: `/user-api/users`
- **Body** (`multipart/form-data`):
  - `firstName` (text, required)
  - `lastName` (text)
  - `email` (text, required)
  - `password` (text, required)
  - `profilePic` (file, optional, jpg/png < 2MB)

#### Get All Active Articles
- **Method**: `GET`
- **URL**: `/user-api/articles`
- **Response** (`200 OK`): Array of active articles populated with author information.

#### Get Article by ID
- **Method**: `GET`
- **URL**: `/user-api/article/:id`
- **Response** (`200 OK`): Single article details with comments and author.

#### Add Comment to Article
- **Method**: `PUT`
- **URL**: `/user-api/articles`
- **Access**: Logged-in users (`USER`, `AUTHOR`, `ADMIN`)
- **Body**:
  ```json
  {
    "articleId": "64f1...",
    "comment": "Great post!",
    "name": "Jane"
  }
  ```

---

### 3. Author API (`/author-api`)

#### Register Author
- **Method**: `POST`
- **URL**: `/author-api/users`
- **Body** (`multipart/form-data`): Same fields as User registration, sets role to `AUTHOR`.

#### Create Article
- **Method**: `POST`
- **URL**: `/author-api/articles`
- **Access**: `AUTHOR`
- **Body**:
  ```json
  {
    "title": "Understanding Node.js Event Loop",
    "category": "technology",
    "content": "Full article content goes here..."
  }
  ```

#### Get Articles by Author
- **Method**: `GET`
- **URL**: `/author-api/articles/:authorId`
- **Access**: `AUTHOR`

#### Update Article
- **Method**: `PUT`
- **URL**: `/author-api/articles`
- **Access**: `AUTHOR` (must be author of the article)
- **Body**:
  ```json
  {
    "articleId": "64f1...",
    "title": "Updated Title",
    "category": "technology",
    "content": "Updated content..."
  }
  ```

#### Toggle Article Status (Soft Delete / Restore)
- **Method**: `PATCH`
- **URL**: `/author-api/articles/:id/status`
- **Access**: `AUTHOR`
- **Body**:
  ```json
  {
    "isArticleActive": false
  }
  ```

---

### 4. Admin API (`/admin-api`)

*All admin endpoints require `verifyToken("ADMIN")`.*

#### Get Platform Analytics
- **Method**: `GET`
- **URL**: `/admin-api/stats`
- **Response** (`200 OK`):
  ```json
  {
    "message": "Platform stats fetched",
    "payload": {
      "totalUsers": 24,
      "totalAuthors": 6,
      "totalArticles": 42,
      "activeArticles": 39
    }
  }
  ```

#### Get All Users
- **Method**: `GET`
- **URL**: `/admin-api/users`

#### Toggle User Active Status (Block / Unblock)
- **Method**: `PATCH`
- **URL**: `/admin-api/users/:userId/status`
- **Body**:
  ```json
  {
    "isActive": false
  }
  ```

#### Get All Articles (Moderation)
- **Method**: `GET`
- **URL**: `/admin-api/articles`

#### Toggle Article Status (Admin Moderation)
- **Method**: `PATCH`
- **URL**: `/admin-api/articles/:articleId/status`
- **Body**:
  ```json
  {
    "isArticleActive": false
  }
  ```