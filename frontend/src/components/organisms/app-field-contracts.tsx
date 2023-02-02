import React, { useEffect, useState, Dispatch, SetStateAction } from 'react';
import Typography from '@mui/joy/Typography';
import { PrivacyRule, PrivacySchema } from "../../types/Schemas";
import Stack from '@mui/joy/Stack';
import CheckIcon from '@mui/icons-material/Check';
import Alert from '@mui/joy/Alert';
import Box from '@mui/joy/Box';
import Chip from '@mui/joy/Chip';
import Grid from '@mui/joy/Grid';
import Tabs from '@mui/joy/Tabs';
import TabList from '@mui/joy/TabList';
import Tab, { tabClasses } from '@mui/joy/Tab';
import TabPanel from '@mui/joy/TabPanel';
import Checkbox from '@mui/joy/Checkbox';
import Button from '@mui/joy/Button';
import Input from '@mui/joy/Input';
import { useTranslation } from "react-i18next";

import { InputPrice } from '../atoms/input-price';
import { CheckboxChip } from '../molecules/checkbox-chips';
import { FieldContractStorage } from '../molecules/field-contract-storage';
import { FieldContractType } from '../molecules/field-contract-types';
import { ContractData, ContractType } from '../../types/Schemas';

interface MoleculeProps {
  privacySchema: PrivacySchema;
  listContract: ContractData[];
  setListContract: Dispatch<SetStateAction<ContractData[]>>;
}


export const AppFieldContract = ({ privacySchema, listContract, setListContract }: MoleculeProps) => {
  const { t } = useTranslation();
  const [available, setAvailable] = useState<string[]>([]);
  
  const [index, setIndex] = React.useState(0);
  useEffect(() => {
    const newAvailable = Object.keys(privacySchema.fields).filter(
      (field) => privacySchema.fields[field] === PrivacyRule.Restricted
    );
    setAvailable(newAvailable);
    // Remove the fields from contracts 
  }, [privacySchema.modified])

  const addContract = () => {
    const idx = listContract.length;
    const contract: ContractData = {
      dataUsed: [],
      formula: {},
      type: ContractType.ACCESS,
      name: `Contract ${listContract.length}`,
      contract: '',
      isError: false,
      errors: [],
      price: 0,
      share: 0,
      qty: 0,
      currency: "FIL",
    }
    setListContract((prev) => ([...prev, contract]));
    setIndex(idx);
  }

  const setContract = (contract: ContractData, idx: number) => {
    const oldContract = [...listContract];
    oldContract[idx] = contract;
    setListContract(oldContract);
  }

  const setChosen = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.dataset && event.target.dataset.index !== undefined && event.target.dataset.name) {
      const idx = parseInt(event.target.dataset.index, 10);
      let oldContract = [...listContract];
      let dataUsed;
      if (event.target.checked === false) {
        dataUsed = oldContract[idx].dataUsed.filter((used) => event.target.dataset.name !== used)
      } else {
        dataUsed = [...oldContract[idx].dataUsed, event.target.dataset.name]
      }
      oldContract[idx] = {
        ...oldContract[idx],
        dataUsed,
      }
      setListContract(oldContract)
      console.log(event.target.dataset.index)
    }
  }

  const removeContract = () => {

  }

  return (<Stack spacing={1}>
    <Button onClick={addContract} size="sm">{t<string>('privacy.add')}</Button>
    <Typography level="body2">
      {t<string>('privacy.addDesc')}
    </Typography>
    {
      <Box
        sx={{
          bgcolor: 'background.body',
          flexGrow: 1,
          m: -3,
          overflowX: 'hidden',
          borderRadius: 'md',
        }}
      >
        <Tabs
          aria-label="Pipeline"
          value={index}
          onChange={(event, value) => setIndex(value as number)}
          sx={{ '--Tabs-gap': '0px' }}
        >
          <TabList
            variant="plain"
            sx={{
              width: '100%',
              mx: 'auto',
              pt: 2,
              alignSelf: 'flex-start',
              [`& .${tabClasses.root}`]: {
                bgcolor: 'transparent',
                boxShadow: 'none',
                '&:hover': {
                  bgcolor: 'transparent',
                },
                [`&.${tabClasses.selected}`]: {
                  color: 'primary.plainColor',
                  fontWeight: 'lg',
                  '&:before': {
                    content: '""',
                    display: 'block',
                    position: 'absolute',
                    zIndex: 1,
                    bottom: '-1px',
                    left: 'var(--List-item-paddingLeft)',
                    right: 'var(--List-item-paddingRight)',
                    height: '3px',
                    borderTopLeftRadius: '3px',
                    borderTopRightRadius: '3px',
                    bgcolor: 'primary.500',
                  },
                },
              },
            }}
          >
            {listContract.map((contract, idx) => (
              <Tab key={`${contract.name}-tab`}>
                {contract.name}
                {(contract.type !== ContractType.STORAGE) && <Chip
                  size="sm"
                  variant="soft"
                  color={index === idx ? 'primary' : 'neutral'}
                  sx={{ ml: 1 }}
                >
                  {contract.dataUsed.length}
                </Chip>}
              </Tab>
            ))}
          </TabList>
          <Box
            sx={(theme) => ({
              '--bg': theme.vars.palette.background.level3,
              height: '1px',
              background: 'var(--bg)',
              boxShadow: '0 0 0 100vmax var(--bg)',
              clipPath: 'inset(0 -100vmax)',
            })}
          />
          <Box
            sx={(theme) => ({
              '--bg': theme.vars.palette.background.surface,
              background: 'var(--bg)',
              boxShadow: '0 0 0 100vmax var(--bg)',
              clipPath: 'inset(0 -100vmax)',
              minHeight: '300px',
              px: 1,
              py: 1,
            })}
          >
            {listContract.map((contract, idx) => (
              (contract.type === ContractType.STORAGE) ? <FieldContractStorage
                key={`${contract.name}-field`}
                idx={idx}
                contract={contract}
                setContract={setContract}
              /> : <FieldContractType
                key={`${contract.name}-field`}
                idx={idx}
                contract={contract}
                available={available}
                setChosen={setChosen}
                setContract={setContract}
              />
              
            ))}
          </Box>
        </Tabs>
      </Box>
    }

  </Stack>);
}
/*
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
                    <Input placeholder="name" />
                  </Grid>
                  <Grid xs={12} md={6}>
                    <InputPrice />
                  </Grid>
                  <Grid xs={12} md={6}>
                    <Input placeholder="Contract template" />
                  </Grid>
                  <Grid xs={12} md={6}>
                    <Input placeholder="Share to users [%]" />
                  </Grid>
                  <Grid xs={12} md={6}>
                    <Input placeholder="Group Quantities" />
                  </Grid>
                </Grid>
              </TabPanel>
*/
/*
(listContract.length === 0) ?
      <Alert variant="soft">{t<string>('privacy.none')}</Alert>
      :
{listContract.map((contract, idx) => (
              <TabPanel key={`${contract.name}-panel`} value={idx}>
                <Typography
                  level="h2"
                  component="div"
                  fontSize="lg"
                  mb={2}
                  textColor="text.primary"
                >
                  {`${contract.name}-panel`}
                </Typography>
              </TabPanel>
            ))}
*/