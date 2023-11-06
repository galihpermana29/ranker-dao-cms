import React from 'react';

import { CookiesProvider } from 'react-cookie';
import ReactDOM from 'react-dom/client';

import App from '@/App';

import '@/scss/global.scss';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <CookiesProvider>
      <App />
    </CookiesProvider>
  </React.StrictMode>
);
