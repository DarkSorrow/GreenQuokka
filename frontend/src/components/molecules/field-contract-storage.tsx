import React from 'react';
import Grid from '@mui/joy/Grid';
import TabPanel from '@mui/joy/TabPanel';
import Input from '@mui/joy/Input';
import FormLabel from '@mui/joy/FormLabel';
import FormControl from '@mui/joy/FormControl';
import { useTranslation } from "react-i18next";

import { InputPrice } from '../atoms/input-price';
import { ContractData } from '../../types/Schemas';

interface MoleculeProps {
  idx: number;
  contract: ContractData;
  setContract: (contract: ContractData, idx: number) => void;
}

export const FieldContractStorage = ({ idx, contract, setContract }: MoleculeProps) => {
  const { t } = useTranslation();
  const inputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.dataset && event.target.dataset.index !== undefined && event.target.dataset.name) {
    }
  }
  /*const selectChange = (e: any, newValue: any) => {
  }*/
  return (
    <TabPanel key={`${contract.name}-panel`} value={idx}>
      <Grid container spacing={1} sx={{ flexGrow: 1 }}>
        <Grid xs={12} md={6}>
          <FormControl>
            <FormLabel>{t<string>('privacy.address')}</FormLabel>
            <Input data-idx={idx} onChange={inputChange} data-name="address" placeholder="address" />
          </FormControl>
        </Grid>
        <Grid xs={12} md={6}>
          <FormControl>
            <FormLabel>{t<string>('privacy.fund')}</FormLabel>
            <InputPrice idx={idx} contract={contract} setContract={setContract} />
          </FormControl>
        </Grid>
      </Grid>
    </TabPanel>
  );
}