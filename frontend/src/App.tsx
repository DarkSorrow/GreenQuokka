import { Suspense, lazy } from 'react';
import { BrowserRouter as Router } from "react-router-dom";
import { CssVarsProvider } from '@mui/joy/styles';
import CssBaseline from '@mui/joy/CssBaseline';
import { WagmiConfig, createClient, configureChains } from 'wagmi';
import { mainnet, filecoin, filecoinHyperspace } from 'wagmi/chains';
import { publicProvider } from 'wagmi/providers/public';
import { InjectedConnector } from 'wagmi/connectors/injected';


import { AuthProvider, useAuth } from './providers/auth';
import { LoadingSuspense } from './components/atoms/loading-suspense';
import filesTheme from './styles/theme';
import { AnonymousPage } from './components/pages/anonymous';
// import { AppPage } from './components/pages/app';
const AppPage = lazy(() => import('./components/pages/app'));

const { chains, provider } = configureChains(
  [mainnet, filecoin, filecoinHyperspace], [publicProvider()]
)

const client = createClient({
  autoConnect: true,
  connectors: [new InjectedConnector({ chains })],
  provider,
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
