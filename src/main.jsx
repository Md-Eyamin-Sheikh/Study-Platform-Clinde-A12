import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";
import Register from './Page/Authentication/Register.jsx';
import LoginPage from './Page/Authentication/LoginPage.jsx';

import AuthProvider from './providers/AuthProvider.jsx';
import ProtectedRoute from './Component/ProtectedRoute.jsx';
import HomePage from './Page/Home Page/HomePage.jsx';
import MainRout from './MainRout/MainRout.jsx';
import DetalsPage from './Page/Home Page/Component/SessionDetails.jsx';
import PaymentPage from './Page/PaymentPage.jsx';
import DashboardRouter from './Page/Dashboard/DashboardRouter.jsx';
import AdminDashboard from './Page/Dashboard/AdminDashboard.jsx';


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
      {
        path: "/details/:id",
        element:<DetalsPage/>
      },
      {
        path: "/payment",
        element: <PaymentPage/>
      },
      {
        path: "/dashboard",
        element: <DashboardRouter/>
      },
      {
        path: "/admin",
        element: (
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminDashboard />
          </ProtectedRoute>
        )
      }
      
      // {
      //   path: "/sessions",
      //   element: <StudySessionsPlatform />
      // },
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
