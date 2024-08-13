import { NextUIProvider } from '@nextui-org/react';
import { RouterProvider } from 'react-router-dom';

import './App.css';

import { router } from './config/router';

function App() {
  return (
    <NextUIProvider className='dark h-full text-foreground bg-background'>
      <div className='h-full container mx-auto px-4 flex items-center justify-center'>
        <RouterProvider router={router} />
      </div>
    </NextUIProvider>
  );
}

export default App;
