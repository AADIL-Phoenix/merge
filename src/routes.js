import { createBrowserRouter } from 'react-router-dom';
import Login from './Login/Login';
import ChatsPage from './Components/Chats/ChatsPage';
import PrivateRoute from './Components/PrivateRoute';
import Layout from './comp/layout/layout';
import MainHome from './MainHomeComp/frontend/MainHome';
import CreateProfile from './Community/components/CreateProfile';
import UserProfile from './Community/components/UserProfile';
import NotFound from './Components/NotFound';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        path: '/',
        element: (
          <PrivateRoute>
            <MainHome />
          </PrivateRoute>
        )
      },
      {
        path: '/create-profile',
        element: (
          <PrivateRoute>
            <CreateProfile />
          </PrivateRoute>
        )
      },
      {
        path: '/profile',
        element: (
          <PrivateRoute>
            <UserProfile />
          </PrivateRoute>
        )
      },
      {
        path: '/profile/:id',
        element: (
          <PrivateRoute>
            <UserProfile />
          </PrivateRoute>
        )
      },
      {
        path: '/chats',
        element: (
          <PrivateRoute>
            <ChatsPage />
          </PrivateRoute>
        )
      },
      {
        path: '/chats/:chatId',
        element: (
          <PrivateRoute>
            <ChatsPage />
          </PrivateRoute>
        )
      },
      {
        path: '/chats/group/:groupId',
        element: (
          <PrivateRoute>
            <ChatsPage />
          </PrivateRoute>
        )
      }
    ]
  },
  {
    path: '/login',
    element: <Login />
  },
  {
    path: '*',
    element: <NotFound />
  }
]);

export default router;
