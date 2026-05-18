// import Register from "./Components/Register";
// import Login from "./Components/Login";
// import AddArticle from "./Components/AddArticle";
// import Home from "./Components/Home";
// import RootLayout from "./Components/RootLayout";
// import EditArticle from './Components/EditArticle.jsx'
// import AuthorArticles from "./Components/AuthorArticles.jsx";
// import AuthorProfile from "./Components/AuthorProfile.jsx";
// import WriteArticle from "./Components/WriteArticle.jsx";
// import UserProfile from '../src/Components/UserProfile'
// import Logout from "./Components/Logout";
// import ProtectedRoute from "./Components/ProtectedRoute";
// import { createBrowserRouter, RouterProvider, Navigate } from "react-router";


// import ArticleByID from "./Components/ArticleById.jsx";
// import { Toaster } from "react-hot-toast";

// function App() {
//   const routerObj = createBrowserRouter([
//     {
//       path: "/",
//       element: <RootLayout />,
//       children: [
//         ,
//         {
//           path: "",
//           element: <Home />,
//         },
//         {
//           path: "register",
//           element: <Register />,
//         },
//         {
//           path: "login",
//           element: <Login />,
//         },
//         {
//           path: "user-profile",
//           element: <UserProfile />,
//         },
//         {
//           path: "author-profile",
//           element: <AuthorProfile />,
//           children: [
//             {
//               index: true,
//               element: <AuthorArticles />,
//             },
//             {
//               path: "articles",
//               element: <AuthorArticles />,
//             },
//             {
//               path: "write-article",
//               element: <WriteArticle />,
//             },
//           ],
//         },
//         {
//           path: "article/:id",
//           element: <ArticleByID />,
//         },
//         {
//           path:"edit-article",
//           element:<EditArticle />
//         }
//       ],
//     },
//   ]);

//   return (
//     <>
//       <Toaster position="top-center" reverseOrder={false} />
//       <RouterProvider router={routerObj} />
//     </>
//   );
// }

// export default App;
import Register from "./Components/Register";
import Login from "./Components/Login";
import Home from "./Components/Home";
import RootLayout from "./Components/RootLayout";
import EditArticle from './Components/EditArticle.jsx'
import AuthorArticles from "./Components/AuthorArticles.jsx";
import AuthorProfile from "./Components/AuthorProfile.jsx";
import WriteArticle from "./Components/WriteArticle.jsx";
import UserProfile from "./Components/UserProfile";
import ArticleByID from "./Components/ArticleById.jsx";

import { createBrowserRouter, RouterProvider, Navigate } from "react-router";
import { Toaster } from "react-hot-toast";

function App() {

  const routerObj = createBrowserRouter([

    {
      path: "/",
      element: <RootLayout />,

      children: [

        {
          path: "",
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
          element: <UserProfile />,
        },

        {
          path: "author-profile",
          element: <AuthorProfile />,

          children: [

            {
              index: true,
              element: <Navigate to="articles" replace />,
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
          path: "article/:id",
          element: <ArticleByID />,
        },

        {
          path: "edit-article/:id",
          element: <EditArticle />,
        }

      ],
    },

  ])

  return (
    <>

      <Toaster
        position="top-center"
        reverseOrder={false}
      />

      <RouterProvider router={routerObj} />

    </>
  )
}

export default App