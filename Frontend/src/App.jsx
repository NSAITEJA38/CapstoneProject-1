import { createBrowserRouter, RouterProvider } from "react-router";
import { Toaster } from "react-hot-toast";

import RootLayout from "./Components/RootLayout";
import Home from "./Components/Home";
import Register from "./Components/Register";
import Login from "./Components/Login";
import UserProfile from "./Components/UserProfile";
import AuthorProfile from "./Components/AuthorProfile";
import AuthorArticles from "./Components/AuthorArticles";
import WriteArticle from "./Components/WriteArticle";
import EditArticle from "./Components/EditArticle";
import ArticleByID from "./Components/ArticleById";
import AdminProfile from "./Components/AdminProfile";
import ProtectedRoute from "./Components/ProtectedRoute";

function App() {
  const routerObj = createBrowserRouter([
    {
      path: "/",
      element: <RootLayout />,
      children: [
        {
          index: true,
          element: <Home />,
        },
        {
          path: "register",
          element: <Register />,
        },
        {
          path: "login",
          element: <Login />,
        },
        {
          path: "user-profile",
          element: (
            <ProtectedRoute allowedRoles={["USER", "ADMIN"]}>
              <UserProfile />
            </ProtectedRoute>
          ),
        },
        {
          path: "author-profile",
          element: (
            <ProtectedRoute allowedRoles={["AUTHOR", "ADMIN"]}>
              <AuthorProfile />
            </ProtectedRoute>
          ),
          children: [
            {
              index: true,
              element: <AuthorArticles />,
            },
            {
              path: "articles",
              element: <AuthorArticles />,
            },
            {
              path: "write-article",
              element: <WriteArticle />,
            },
          ],
        },
        {
          path: "admin-profile",
          element: (
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <AdminProfile />
            </ProtectedRoute>
          ),
        },
        {
          path: "article/:id",
          element: <ArticleByID />,
        },
        {
          path: "edit-article/:id",
          element: (
            <ProtectedRoute allowedRoles={["AUTHOR", "ADMIN"]}>
              <EditArticle />
            </ProtectedRoute>
          ),
        },
        {
          path: "edit-article",
          element: (
            <ProtectedRoute allowedRoles={["AUTHOR", "ADMIN"]}>
              <EditArticle />
            </ProtectedRoute>
          ),
        },
        {
          path: "*",
          element: <Home />,
        },
      ],
    },
  ]);

  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <RouterProvider router={routerObj} />
    </>
  );
}

export default App;