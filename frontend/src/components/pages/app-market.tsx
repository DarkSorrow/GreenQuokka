import { useState, useEffect } from 'react';
import Tabs from '@mui/joy/Tabs';
import TabList from '@mui/joy/TabList';
import Tab from '@mui/joy/Tab';
import TabPanel from '@mui/joy/TabPanel';
import Typography from '@mui/joy/Typography';
import Stack from '@mui/joy/Stack';
import Alert from '@mui/joy/Alert';
import Sheet from '@mui/joy/Sheet';
import Divider from '@mui/joy/Divider';
import { useTranslation } from "react-i18next";
import { useAccount } from 'wagmi';

import { LoadingSuspense } from '../atoms/loading-suspense';
import { AppWalletInfo } from '../molecules/app-wallet-info';
import { AppStorageContracts } from '../molecules/app-storage-contracts';
//https://api.hyperspace.node.glif.io/rpc/v1
interface ActorsProps {
  index: number;
  data: any[];
}
const ActorsTab = ({ index, data }: ActorsProps) => {
  const { t } = useTranslation();
  const { isConnected } = useAccount();
  return (
  <>
    <Typography level="h5">{t<string>('place.owned')}</Typography>
    <Divider />
    {(data.length === 0) ?
      <Alert color="primary" variant="soft">{t<string>('place.nodata')}</Alert>
      :
      <Sheet>Holy sheet!</Sheet>
    }
    <Typography level="h5">{t<string>('place.list')}</Typography>
    <Divider />
    {(isConnected) ?
      <Stack spacing={2} sx={{ width: '100%' }}>
        <SelectTab index={index} />
      </Stack>
      :
      <Alert color="danger" variant="soft">{t<string>('place.connect')}</Alert>
    }
  </>
  );
};

const StorageTab = ({ index, data }: ActorsProps) => {
  const { t } = useTranslation();
  const { isConnected } = useAccount();
  return (
  <>
    <Typography level="h5">{t<string>('place.handoff')}</Typography>
    <Divider />
    {(data.length === 0) ?
      <Alert color="primary" variant="soft">{t<string>('place.nodata')}</Alert>
      :
      <Sheet>Holy sheet!</Sheet>
    }
    <Typography level="h5">{t<string>('place.negociation')}</Typography>
    <Divider />
    {(data.length === 0) ?
      <Alert color="primary" variant="soft">{t<string>('place.nodata')}</Alert>
      :
      <Sheet>Holy sheet!</Sheet>
    }
    <Typography level="h5">{t<string>('place.discovery')}</Typography>
    <Divider />
    {(isConnected) ?
      <Stack spacing={2} sx={{ width: '100%' }}>
        <SelectTab index={index} />
      </Stack>
      :
      <Alert color="danger" variant="soft">{t<string>('place.connect')}</Alert>
    }
  </>
  );
};
interface SelectProps {
  index: number;
}

const SelectTab = ({ index }: SelectProps) => {
  switch (index) {
    case 0:
      return <AppStorageContracts contracts={['0x6cc1467EF61bf1b6807Ee69919F051eEb81565f2']}/>
    case 1:
      return <Sheet>Compute power</Sheet>
    case 2:
      return <Sheet>Token gated list</Sheet>
    default:
      return <Alert color="danger" variant="soft">Error</Alert>
  }
}

interface TabPanelProps {
  index: number;
}

const MarketTab = ({ index }: TabPanelProps) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any[]>([]);
  const { isConnected, address } = useAccount();
  useEffect(() => {
    setLoading(true);
    const init = async () => {
      setLoading(false);
    };
    init();
  }, [index])

  if (loading) {
    return <LoadingSuspense />
  }
  return (<TabPanel sx={{ p: 3 }} value={index}>
    <Stack spacing={2} sx={{ width: '100%' }}>
    {(isConnected && address) && <AppWalletInfo address={address} />}
    {index === 0 ? 
      <StorageTab data={data} index={index} />
    :
      <ActorsTab data={data} index={index} />}
    </Stack>
  </TabPanel>)
}

export const AppMarketPage = () => {
  const [index, setIndex] = useState(0);
  const { t } = useTranslation();
  return (
    <Tabs aria-label="Market tabs" value={index} onChange={(event, value) => setIndex(value as number)} sx={{ borderRadius: 'lg' }}>
      <TabList>
        <Tab variant={index === 0 ? 'outlined' : 'plain'} orientation="vertical">
          {t<string>('contractType.0')}
        </Tab>
        <Tab variant={index === 1 ? 'outlined' : 'plain'} orientation="vertical">
          {t<string>('contractType.1')}
        </Tab>
        <Tab variant={index === 2 ? 'outlined' : 'plain'} orientation="vertical">
          {t<string>('contractType.2')}
        </Tab>
      </TabList>
      <MarketTab index={index} />
    </Tabs>
  );
}
/**
  View the deals server to offer a drop down list when we select storage area

 */