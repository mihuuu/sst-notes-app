import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import { Amplify } from 'aws-amplify';
import App from './App.tsx';
import config from './config.ts';
import './index.css';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';

Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: config.cognito.USER_POOL_ID,
      userPoolClientId: config.cognito.APP_CLIENT_ID,
      identityPoolId: config.cognito.IDENTITY_POOL_ID,
      loginWith: {
        email: true,
        username: false,
      },
    },
  },
  Storage: {
    S3: {
      bucket: config.s3.BUCKET,
      region: config.s3.REGION,
    },
  },
  API: {
    REST: {
      notes: {
        endpoint: config.apiGateway.URL,
        region: config.apiGateway.REGION,
      },
    },
  },
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <ThemeProvider>
        <Router>
          <App />
        </Router>
      </ThemeProvider>
    </AuthProvider>
  </StrictMode>
);
