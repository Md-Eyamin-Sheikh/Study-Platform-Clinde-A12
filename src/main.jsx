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
import AdminDashboard from './Page/Dashboard/Admin/AdminDashboard.jsx';
import StudySessionsPlatform from './Page/Home Page/Component/StudySessionsPlatform.jsx';
import UpdateSession from './Page/Dashboard/Admin/UpdateSession.jsx';
import TutorProfile from './Page/Home Page/Component/TutorProfile.jsx';
import ProfilePage from './Page/Dashboard/ProfilePage.jsx';

// Admin components
import AdminStats from './Page/Dashboard/Admin/AdminStats.jsx';
import ViewAllUsers from './Page/Dashboard/Admin/ViewAllUsers.jsx';
import ViewAllSessions from './Page/Dashboard/Admin/ViewAllSessions.jsx';
import ViewAllMaterials from './Page/Dashboard/Admin/ViewAllMaterials.jsx';

// Tutor components
import CreateSession from './Page/Dashboard/Tutor Dashboard/CreateSession.jsx';
import ViewSessions from './Page/Dashboard/Tutor Dashboard/ViewSessions.jsx';
import UploadMaterials from './Page/Dashboard/Tutor Dashboard/UploadMaterials.jsx';
import ViewMaterials from './Page/Dashboard/Tutor Dashboard/ViewMaterials.jsx';

// Student components
import ViewBookedSessions from './Page/Dashboard/Student Dashboard/Component/ViewBookedSessions.jsx';
import CreateNote from './Page/Dashboard/Student Dashboard/Component/CreateNote.jsx';
import ManageNotes from './Page/Dashboard/Student Dashboard/Component/ManageNotes.jsx';
import ViewMaterials1 from './Page/Dashboard/Student Dashboard/Component/ViewMaterials.jsx';


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
        path: "/update-session",
        element: <UpdateSession/>
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
        path: "/tutor-profile/:tutorId",
        element: <TutorProfile/>
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
        path: "/profile",
        element: <ProfilePage/>
      },
     

      // Admin Route
      {
        path: "/adminStats",
        element: <AdminStats />
      },
      {
        path: "/viewAllusers",
        element: <ViewAllUsers />
      },
      {
        path: "/viewAllsessions",
        element: <ViewAllSessions />
      },
      {
        path: "/viewAllmaterials",
        element: <ViewAllMaterials />
      },

      // Tutor Route
      {
        path: "/create-session",
        element: <CreateSession />
      },
      {
        path: "/view-sessions",
        element: <ViewSessions />
      },
      {
        path: "/upload-materials",
        element: <UploadMaterials />
      },
      {
        path: "/view-materials",
        element: <ViewMaterials />
      },


      // Student Route
      {
        path: "/view-booked-sessions",
        element: <ViewBookedSessions />
      },
      {
        path: "/create-note",
        element: <CreateNote />
      },
      {
        path: "/manage-notes",
        element: <ManageNotes />
      },
      {
        path: "/view-materials",
        element: <ViewMaterials1 />
      },

      {
        path: "/admin",
        element: (
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminDashboard />
          </ProtectedRoute>
        )
      },
      
      {
        path: "/sessions",
        element: <StudySessionsPlatform />
      },
      
      
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
