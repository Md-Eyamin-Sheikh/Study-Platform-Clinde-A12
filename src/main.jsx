import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";
import Register from './Page/Authentication/Register.jsx';
import LoginPage from './Page/Authentication/LoginPage.jsx';

import AuthProvider from './providers/AuthProvider.jsx';
import HomePage from './Page/HomePage.jsx';

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage/>,
    children:[
      {
        path: "/login",
        element: <LoginPage/>
      },
      {
        path: '/register',
        element: <Register/>

      }
    ]
  },
  
  
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
    {/* <App /> */}
  </StrictMode>,
)
