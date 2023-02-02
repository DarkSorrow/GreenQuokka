import { Suspense, lazy } from 'react';
import { BrowserRouter as Router } from "react-router-dom";
import { CssVarsProvider } from '@mui/joy/styles';
import CssBaseline from '@mui/joy/CssBaseline';
import { WagmiConfig, createClient } from 'wagmi';
import { getDefaultProvider } from 'ethers';

import { AuthProvider, useAuth } from './providers/auth';
import { LoadingSuspense } from './components/atoms/loading-suspense';
import filesTheme from './styles/theme';
import { AnonymousPage } from './components/pages/anonymous';
// import { AppPage } from './components/pages/app';
const AppPage = lazy(() => import('./components/pages/app'));

const client = createClient({
  autoConnect: true,
  provider: getDefaultProvider(),
})

const BaseApp = () => {
  const { userToken } = useAuth();
  return (
    <CssVarsProvider theme={filesTheme}>
      <CssBaseline />
      <Suspense fallback={<LoadingSuspense />}>
      <WagmiConfig client={client}>
        <Router>
          {userToken === null ?
          <AnonymousPage /> : 
          <AppPage />}
        </Router>
      </WagmiConfig>
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
