import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";
import Register from './Page/Authentication/Register.jsx';
import LoginPage from './Page/Authentication/LoginPage.jsx';
// import Dashboard from './Page/Dashboard.jsx';
// import AdminPanel from './Page/AdminPanel.jsx';

import AuthProvider from './providers/AuthProvider.jsx';
import ProtectedRoute from './Component/ProtectedRoute.jsx';
import HomePage from './Page/HomePage.jsx';
import MainRout from './MainRout/MainRout.jsx';

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainRout/>,
    children:[
      {
        path: "/",
        element: <HomePage/>
      },
      {
        path: "/login",
        element: <LoginPage/>
      },
      {
        path: '/register',
        element: <Register/>
      },
      // {
      //   path: "/dashboard",
      //   element: (
      //     <ProtectedRoute>
      //       <Dashboard />
      //     </ProtectedRoute>
      //   )
      // },
      // {
      //   path: "/admin",
      //   element: (
      //     <ProtectedRoute allowedRoles={['admin']}>
      //       <AdminPanel />
      //     </ProtectedRoute>
      //   )
      // }
    ]
  }
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
    {/* <App /> */}
  </StrictMode>,
)
