import Box from '@mui/joy/Box';
import Button from '@mui/joy/Button';
import Typography from '@mui/joy/Typography';
import { useTranslation } from "react-i18next";
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { InjectedConnector } from 'wagmi/connectors/injected';

export const AnonymousWalletConnect = () => {
  const { t } = useTranslation();
  const { address, isConnected } = useAccount();
  const { connect } = useConnect({
    connector: new InjectedConnector(),
  })
  const { disconnect } = useDisconnect();

  return (
    (isConnected) ?
      <Button size="sm" variant="outlined" color="neutral" onClick={() => disconnect()}
        startDecorator={<Box sx={{
            width: '10px',
            height: '10px',
            borderRadius: '99px',
            bgcolor: 'success.400',
          }}
        />}
        ><Typography level="body2" noWrap>{t<string>('dWallet', { address })}</Typography>
      </Button>
      :
      <Button size="sm" variant="outlined" color="neutral" onClick={() => connect()}
        startDecorator={<Box
          sx={{
            width: '10px',
            height: '10px',
            borderRadius: '99px',
            bgcolor: 'danger.400',
          }}
        />}
      >{t<string>('cWallet')}</Button>
  );
};
