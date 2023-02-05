
import * as React from 'react';
import Divider from '@mui/joy/Divider';
import ListDivider from '@mui/joy/ListDivider';
import ListItem from '@mui/joy/ListItem';
import ListItemDecorator from '@mui/joy/ListItemDecorator';
import ListItemContent from '@mui/joy/ListItemContent';
import Typography from '@mui/joy/Typography';
import Sheet, { sheetClasses } from '@mui/joy/Sheet';
import { useTranslation } from "react-i18next";
import { useNetwork, useBalance } from 'wagmi';
import Stack from '@mui/joy/Stack';
import Alert from '@mui/joy/Alert';

import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import NetworkCheckIcon from '@mui/icons-material/NetworkCheck';
import ImportContactsIcon from '@mui/icons-material/ImportContacts';

interface MoleculeProps {
  address: `0x${string}`;
}

export const AppWalletInfo = ({ address }: MoleculeProps) => {
  const { t } = useTranslation();
  const { chain } = useNetwork();
  const { data, isError, isLoading } = useBalance({
    address,
    chainId: chain?.id,
  })

  if (isLoading) return <div>Fetching balance…</div>
  if (isError) return <div>Error fetching balance</div>
  return (
    <Stack
      direction={{ xs: 'column', md: 'row' }}
      spacing={1}
      justifyContent="center"
    >
      <Alert color="success" startDecorator={<AccountBalanceIcon />}>
        {t<string>('balance', { val: `${data?.formatted} ${data?.symbol}` })}
      </Alert>
      <Alert color="primary" startDecorator={<NetworkCheckIcon />}>
        {t<string>('network', { val: chain?.network })}
      </Alert>
      <Alert color="neutral" startDecorator={<ImportContactsIcon />}>
        {t<string>('address')}
        <Typography noWrap>{address}</Typography>
      </Alert>
    </Stack>
  );
}

/**
<List
    orientation="horizontal"
    variant="outlined"
    sx={{
      bgcolor: 'background.body',
      borderRadius: 'sm',
      boxShadow: 'sm',
      flexGrow: 0,
      mx: 'auto',
      '--List-decorator-size': '48px',
      '--List-item-paddingY': '1rem',
    }}
  >
    <ListItem>
      <ListItemDecorator>
        <AccountBalanceIcon />
      </ListItemDecorator>
      <ListItemContent htmlFor="balance" component="label">
        {t<string>('balance', { val: `${data?.formatted} ${data?.symbol}` })}
      </ListItemContent>
    </ListItem>
    <ListDivider inset="gutter" />
    <ListItem>
      <ListItemDecorator>
          <NetworkCheckIcon />
      </ListItemDecorator>
      <ListItemContent htmlFor="network" component="label">
        {t<string>('network', { val: chain?.network })}
      </ListItemContent>
    </ListItem>
    <ListDivider inset="gutter" />
    <ListItem>
      <ListItemDecorator>
          <ImportContactsIcon />
      </ListItemDecorator>
      <ListItemContent htmlFor="contract" component="label">
        {t<string>('address')}
      </ListItemContent>
      <Typography noWrap>{address}</Typography>
    </ListItem>
  </List>
 */