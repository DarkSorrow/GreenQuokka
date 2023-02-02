import * as React from 'react';
import Divider from '@mui/joy/Divider';
import Input from '@mui/joy/Input';
import Select from '@mui/joy/Select';
import Option from '@mui/joy/Option';

import { ContractData } from '../../types/Schemas';
interface MoleculeProps {
  idx: number;
  contract: ContractData;
  setContract: (contract: ContractData, idx: number) => void;
}

export const InputPrice = ({ idx, contract, setContract }: MoleculeProps) => {
  const setPrice = (event: React.ChangeEvent<HTMLInputElement>) => {
    const price = parseFloat(event.target.value);
    if (!Number.isNaN(price) && price >= 0) {
      setContract({
        ...contract,
        price,
      }, idx)  
    }
  }
  const setCurrency = (value: string | null) => {
    console.log(value);
    if (value) {
      setContract({
        ...contract,
        currency: value,
      }, idx)
    }
  }
  return (
    <Input
      placeholder="Amount"
      value={contract.price}
      type="number"
      startDecorator={{ dollar: '$', eur: '€', BTC: '฿', FIL: 'FIL', ETH: 'ETH' }[contract.currency]}
      onChange={setPrice}
      endDecorator={
        <React.Fragment>
          <Divider orientation="vertical" />
          <Select
            variant="plain"
            value={contract.currency}
            onChange={(_, value) => setCurrency(value!)}
            sx={{ mr: -1.5, '&:hover': { bgcolor: 'transparent' } }}
          >
            <Option value="FIL">Filecoin</Option>
            <Option value="dollar">US dollar</Option>
            <Option value="euro">Euro</Option>
            <Option value="BTC">Bitcoin</Option>
            <Option value="ETH">ETH</Option>
          </Select>
        </React.Fragment>
      }
    />
  );
}
