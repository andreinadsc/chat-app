import { RouterProvider, createBrowserRouter } from 'react-router-dom';

import HomePage from './pages/HomePage';
import Chats from './pages/Chats';
import ErrorBoundary from './components/Common/ErrorBoundary';

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <ErrorBoundary>
        <HomePage />
      </ErrorBoundary>)
  },
  {
    path: '/chats',
    element: (
      <ErrorBoundary>
        <Chats />
      </ErrorBoundary>
    ),
  },
]);


function App() {
  return <RouterProvider router={router} />;
}

export default App;
