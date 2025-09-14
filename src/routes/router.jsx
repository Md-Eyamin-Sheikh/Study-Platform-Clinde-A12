import { createBrowserRouter } from "react-router-dom";
import MainRout from '../MainRout/MainRout.jsx';
import HomePage from '../Page/Home Page/HomePage.jsx';
import LoginPage from '../Page/Authentication/LoginPage.jsx';
import Register from '../Page/Authentication/Register.jsx';
import DetalsPage from '../Page/Home Page/Component/SessionDetails.jsx';
import PaymentPage from '../Page/PaymentPage.jsx';
import Dashboard from '../Page/Dashboard/Dashboard.jsx';

export const router = createBrowserRouter([
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
        element: <DetalsPage/>
      },
      {
        path: "/payment",
        element: <PaymentPage/>
      },
      {
        path: "/dashboard",
        element: <Dashboard />
      }
    ]
  }
]);
