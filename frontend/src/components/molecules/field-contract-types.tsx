import React from 'react';
import { PrivacyRule } from "../../types/Schemas";
import Grid from '@mui/joy/Grid';
import FormLabel from '@mui/joy/FormLabel';
import FormControl from '@mui/joy/FormControl';
import TabPanel from '@mui/joy/TabPanel';
import Option from '@mui/joy/Option';
import Select from '@mui/joy/Select';
import Input from '@mui/joy/Input';
import { useTranslation } from "react-i18next";
import PercentIcon from '@mui/icons-material/Percent';

import { InputPrice } from '../atoms/input-price';
import { CheckboxChip } from './checkbox-chips';
import { ContractData, ContractType } from '../../types/Schemas';

interface MoleculeProps {
  idx: number;
  contract: ContractData;
  available: string[];
  setChosen: (event: React.ChangeEvent<HTMLInputElement>) => void;
  setContract: (contract: ContractData, idx: number) => void;
}

export const FieldContractType = ({ idx, contract, available, setChosen, setContract }: MoleculeProps) => {
  const { t } = useTranslation();

  const inputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.dataset && event.target.dataset.name) {
      setContract({
        ...contract,
        [event.target.dataset.name]: event.target.value,
      }, idx);
    }
  }
  const inputShareChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const share = parseFloat(event.target.value);
    if (!Number.isNaN(share) && share >= 0 && share <= 100) {
      setContract({
        ...contract,
        share,
      }, idx);
    }
  }
  const inputQuantityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const qty = parseInt(event.target.value, 10);
    if (!Number.isNaN(qty) && qty >= 0) {
      setContract({
        ...contract,
        qty,
      }, idx);
    }
  }
  const selectChange = (e: any, newValue: any) => {
    setContract({
      ...contract,
      type: newValue as ContractType,
    }, idx);
  }
  return (
    <TabPanel key={`${contract.name}-panel`} value={idx}>
      <Grid container spacing={1} sx={{ flexGrow: 1 }}>
        <Grid xs={12}>
          <CheckboxChip
            label={t<string>('privacy.available')}
            available={available}
            idx={idx}
            fields={contract.dataUsed}
            setChosen={setChosen}
          />
        </Grid>
        <Grid xs={12} md={6}>
          <FormControl>
            <FormLabel>{t<string>('privacy.name')}</FormLabel>
            <Input onChange={inputChange} placeholder="name" />
          </FormControl>
        </Grid>
        <Grid xs={12} md={6}>
          <FormControl>
            <FormLabel>{t<string>('privacy.type')}</FormLabel>
            <Select
              value={contract.type}
              onChange={selectChange}
            >
              <Option value={ContractType.COMPUTE}>{t<string>(`contractType.${ContractType.COMPUTE}`)}</Option>
              <Option value={ContractType.ACCESS}>{t<string>(`contractType.${ContractType.ACCESS}`)}</Option>
            </Select>
          </FormControl>
        </Grid>
        <Grid xs={12} md={6}>
          <FormControl>
            <FormLabel>{t<string>('privacy.price')}</FormLabel>
            <InputPrice idx={idx} contract={contract} setContract={setContract} />
          </FormControl>
        </Grid>
        <Grid xs={12} md={6}>
          <FormControl>
            <FormLabel>{t<string>('privacy.address')}</FormLabel>
            <Input data-idx={idx} onChange={inputChange} data-name="address" placeholder="address" />
          </FormControl>
        </Grid>
        <Grid xs={12} md={6}>
          <FormControl>
            <FormLabel>{t<string>('privacy.share')}</FormLabel>
            <Input onChange={inputShareChange} placeholder="percent" value={contract.share} endDecorator={<PercentIcon />} />
          </FormControl>
        </Grid>
        <Grid xs={12} md={6}>
          <FormControl>
            <FormLabel>{t<string>('privacy.amount')}</FormLabel>
            <Input onChange={inputQuantityChange} value={contract.qty} placeholder="Quantity" />
          </FormControl>
        </Grid>
      </Grid>
    </TabPanel>
  );
}

/*
<Select
            variant="plain"
            value={currency}
            onChange={(_, value) => setCurrency(value!)}
            sx={{ mr: -1.5, '&:hover': { bgcolor: 'transparent' } }}
          >
*/