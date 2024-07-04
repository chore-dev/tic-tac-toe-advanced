import { createBrowserRouter } from 'react-router-dom';

import { ROUTES } from '../constants/routes';
import Home from '../pages/Home/Home';
import Host from '../pages/Host/Host';
import PlayLocal from '../pages/PlayLocal/PlayLocal';
import PlayOnline from '../pages/PlayOnline/PlayOnline';

export const router = createBrowserRouter([
  {
    path: ROUTES.Home,
    Component: Home
  },
  {
    path: ROUTES.Host,
    Component: Host
  },
  {
    path: ROUTES.PlayLocal,
    Component: PlayLocal
  },
  {
    path: ROUTES.PlayOnline,
    Component: PlayOnline
  }
]);
