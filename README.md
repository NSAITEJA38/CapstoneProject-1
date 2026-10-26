# Full-Stack Blog Application

Welcome to the full-stack Blog Application! This repository contains the complete source code for both the client-side user interface and the server-side API.

## Project Structure

- **`/FRONTEND`**: Contains the React frontend application built with Vite, Tailwind CSS, and Zustand.
- **`/BACKEND`**: Contains the Node.js backend application built with Express, Mongoose (MongoDB), and JWT authentication.

---

## How to Run the Application

To run the application locally, you will need to start both the backend server and the frontend client simultaneously in **two separate terminal windows**.

### Step 1: Start the Backend Server

1. Open a terminal window.
2. Navigate to the backend directory:
   ```bash
   cd BACKEND
   ```
3. Install the required backend dependencies:
   ```bash
   npm install
   ```
4. **Environment Variables**: Create a `.env` file in the `BACKEND` folder. You will need to add your specific configuration keys here (e.g., `PORT`, `DB_URL` for MongoDB, `JWT_SECRET`, Cloudinary API keys, etc.).
5. Start the backend development server:
   ```bash
   npm run dev
   ```

### Step 2: Start the Frontend Client

1. Open a **new** terminal window.
2. Navigate to the frontend directory:
   ```bash
   cd FRONTEND
   ```
3. Install the required frontend dependencies:
   ```bash
   npm install
   ```
4. Start the frontend development server:
   ```bash
   npm run dev
   ```
5. Open the link provided in your terminal (usually `http://localhost:5173`) in your web browser.

---

## Further Documentation

For more specific information on each part of the project, including how to build them from scratch, please refer to the individual `README.md` files located in their respective folders:
- [Frontend README](./FRONTEND/README.md)
- [Backend README](./BACKEND/README.md)
