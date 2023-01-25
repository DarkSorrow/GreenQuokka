import { Suspense } from 'react';
import { BrowserRouter as Router } from "react-router-dom";
import { CssVarsProvider } from '@mui/joy/styles';
import CssBaseline from '@mui/joy/CssBaseline';

import { AuthProvider, useAuth } from './providers/auth';
import { LoadingSuspense } from './components/atoms/loading-suspense';
import filesTheme from './styles/theme';
import { AnonymousPage } from './components/pages/anonymous';
import { AppPage } from './components/pages/app';

const BaseApp = () => {
  const { userToken } = useAuth();
  console.log(userToken)
  return (
    <CssVarsProvider theme={filesTheme}>
      <CssBaseline />
      <Suspense fallback={<LoadingSuspense />}>
      <Router>
        {userToken === null ?
        <AnonymousPage /> : 
        <AppPage />}
      </Router>
      </Suspense>
    </CssVarsProvider>
  )
}

function App() {
  return (
    <AuthProvider>
      <BaseApp />
    </AuthProvider>
  );
}

export default App;
