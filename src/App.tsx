import { NextUIProvider } from '@nextui-org/react';
import { RouterProvider } from 'react-router-dom';

import './App.css';
import { router } from './config/router';

function App() {
  return (
    <NextUIProvider className='dark text-foreground bg-background h-full flex flex-col items-center justify-center'>
      <RouterProvider router={router} />
    </NextUIProvider>
  );
}

export default App;
