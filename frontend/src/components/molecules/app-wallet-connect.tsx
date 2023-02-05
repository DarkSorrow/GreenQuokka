import Box from '@mui/joy/Box';
import ListItem from '@mui/joy/ListItem';
import ListItemButton from '@mui/joy/ListItemButton';
import ListItemDecorator from '@mui/joy/ListItemDecorator';
import ListItemContent from '@mui/joy/ListItemContent';
import Typography from '@mui/joy/Typography';
import { useTranslation } from "react-i18next";
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { InjectedConnector } from 'wagmi/connectors/injected';

// <ListItemButton variant="soft" color="primary">
export const AppWalletConnect = () => {
  const { t } = useTranslation();
  const { address, isConnected } = useAccount();
  const { connect } = useConnect({
    connector: new InjectedConnector(),
  })
  const { disconnect } = useDisconnect();

  return (
    <ListItem>
      {(isConnected) ?
        <ListItemButton onClick={() => disconnect()}>
          <ListItemDecorator>
            <Box
              sx={{
                width: '10px',
                height: '10px',
                borderRadius: '99px',
                bgcolor: 'success.400',
              }}
            />
          </ListItemDecorator>
          <ListItemContent>
            <Typography level="body2" noWrap>
              {t<string>('dWallet', { address })}
            </Typography>
          </ListItemContent>
        </ListItemButton>
        :
        <ListItemButton onClick={() => connect()}>
          <ListItemDecorator>
            <Box
              sx={{
                width: '10px',
                height: '10px',
                borderRadius: '99px',
                bgcolor: 'danger.400',
              }}
            />
          </ListItemDecorator>
          <ListItemContent>{t<string>('cWallet')}</ListItemContent>
        </ListItemButton>
      }
      
    </ListItem>
  );
};
