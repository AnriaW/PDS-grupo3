import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import CreateApostila from './pages/CreateApostila';
import Home from './pages/Home';
import Loading from './pages/Loading';
import Library from './pages/Library';
import Profile from './pages/Profile';
import Guide from './pages/Guide';
import Apostila from './pages/Apostila';
import EditApostila from './pages/EditApostila';
import ChangePassword from './pages/ChangePassword';
import DeleteAccount from './pages/DeleteAccount';
import RecoverAccount from './pages/RecoverAccount';
import ResetPassword from './pages/ResetPassword';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Landing />,
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/register',
    element: <Register />,
  },
  {
    path: '/home',
    element: <Home />,
  },
  {
    path: '/create-new',
    element: <CreateApostila />,
  },

  {
    path: '/loading',
    element: <Loading />,
  },
  {
    path: '/library',
    element: <Library />,
  },
  {
    path: '/profile',
    element: <Profile />,
  },

  {
    path: '/guide',
    element: <Guide />,
  },
  {
    path: '/apostila',
    element: <Apostila />,
  },
  
  {
    path: '/edit',
    element: <EditApostila />,
  },

  {
    path: '/change-password',
    element: <ChangePassword />,
  },

  {
    path: '/delete-account',
    element: <DeleteAccount />,
  },

  {
    path: '/recover-account',
    element: <RecoverAccount />,
  },

  {
    path: '/reset-password',
    element: <ResetPassword />,
  }

]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
