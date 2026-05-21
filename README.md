# Blog Application

A full-stack blog web application where users can read and comment on articles, and authors can create, manage, and publish their own posts. 

This project is divided into two parts:
- **Frontend**: A React.js application.
- **Backend**: An Express.js REST API with MongoDB.

---

## Features

### User Features
- View all published articles
- Read full article details
- Comment on articles
- View author profiles

### Author Features
- Create new articles
- Edit or delete own articles
- View all authored articles
- Manage profile information

---

## Tech Stack

### Frontend
- **Framework**: React.js
- **Routing**: React Router
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios
- **State Management**: Context API / Redux

### Backend
- **Server**: Node.js & Express.js
- **Database**: MongoDB & Mongoose

---

## Getting Started

### Prerequisites
- Node.js
- MongoDB

### Installation

1. **Clone the repository:**
   ```bash
   git clone <repository_url>
   cd Capstone-project-1
   ```

2. **Backend Setup:**
   ```bash
   cd BACKEND
   npm install
   # Create a .env file and add your environment variables (PORT, DB URL, etc.)
   node server.js
   ```

3. **Frontend Setup:**
   ```bash
   cd Frontend
   npm install
   # Create a .env file if necessary
   npm run dev
   ```

---

## Deployment

The frontend of this application is deployed and can be accessed here:
[**Live Application Link**](https://blog-app-frontend-m1hy.onrender.com/)
