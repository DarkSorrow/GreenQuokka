import * as React from 'react';
import Divider from '@mui/joy/Divider';
import Input from '@mui/joy/Input';
import Select from '@mui/joy/Select';
import Option from '@mui/joy/Option';

export const InputPrice = () => {
  const [currency, setCurrency] = React.useState('dollar');
  return (
    <Input
      placeholder="Amount"
      startDecorator={{ dollar: '$', euro: '฿', fil: 'FIL', eth: 'ETH' }[currency]}
      endDecorator={
        <React.Fragment>
          <Divider orientation="vertical" />
          <Select
            variant="plain"
            value={currency}
            onChange={(_, value) => setCurrency(value!)}
            sx={{ mr: -1.5, '&:hover': { bgcolor: 'transparent' } }}
          >
            <Option value="fil">Filecoin</Option>
            <Option value="dollar">US dollar</Option>
            <Option value="euro">Euro</Option>
            <Option value="ETH">ETH</Option>
          </Select>
        </React.Fragment>
      }
      sx={{ width: 300 }}
    />
  );
}
