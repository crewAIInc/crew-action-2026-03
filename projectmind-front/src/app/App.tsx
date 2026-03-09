import { RouterProvider } from 'react-router';
import { router } from './routes';
import { CurrentProjectProvider } from './context/CurrentProject';

function App() {
  return (
    <CurrentProjectProvider>
      <RouterProvider router={router} />
    </CurrentProjectProvider>
  );
}

export default App;
