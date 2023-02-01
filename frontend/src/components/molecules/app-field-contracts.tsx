import React, { useEffect, useState } from 'react';
import Typography from '@mui/joy/Typography';
import { PrivacyRule, PrivacySchema } from "../../types/Schemas";
import Stack from '@mui/joy/Stack';
import CheckIcon from '@mui/icons-material/Check';
import Alert from '@mui/joy/Alert';
import Box from '@mui/joy/Box';
import Chip from '@mui/joy/Chip';
import Tabs from '@mui/joy/Tabs';
import TabList from '@mui/joy/TabList';
import Tab, { tabClasses } from '@mui/joy/Tab';
import TabPanel from '@mui/joy/TabPanel';
import Checkbox from '@mui/joy/Checkbox';
import Button from '@mui/joy/Button';
import { useTranslation } from "react-i18next";
import { InputPrice } from '../atoms/inpuit-price';
interface MoleculeProps {
  privacySchema: PrivacySchema;
}

interface ContractData {
  dataUsed: string[];
  formula: Record<string,string>;
  name: string;
  contract: string;
  isError: boolean;
  errors: string[];
  price: number;
  currency: string;
}

interface MoleculeCheckChipProps {
  label: string;
  available: string[];
  fields: string[];
  idx: number;
  setChosen: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export const CheckboxChip = ({ label, available, idx, setChosen, fields }: MoleculeCheckChipProps) => {
  console.log(available);
  return (
    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
      <Box
        role="group"
        aria-labelledby="fav-movie"
        sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}
      >
        {available.map((name) => {
          const checked = fields.includes(name);
          return (
            <Chip
              key={name}
              variant={checked ? 'soft' : 'plain'}
              color={checked ? 'primary' : 'neutral'}
              startDecorator={
                checked && <CheckIcon sx={{ zIndex: 1, pointerEvents: 'none' }} />
              }
            >
              <Checkbox
                variant="outlined"
                color={checked ? 'primary' : 'neutral'}
                disableIcon
                overlay
                label={name}
                checked={checked}
                slotProps={{
                  input: {
                    "data-name": name,
                    "data-index": idx
                  }
                }}
                onChange={setChosen}
              />
            </Chip>
          );
        })}
      </Box>
    </Box>
  );
}

export const AppFieldContract = ({ privacySchema }: MoleculeProps) => {
  const { t } = useTranslation();
  const [available, setAvailable] = useState<string[]>([]);
  const [listContract, setListContract] = useState<ContractData[]>([]);
  const [index, setIndex] = React.useState(0);
  useEffect(() => {
    const newAvailable = Object.keys(privacySchema.fields).filter((field) => privacySchema.fields[field] === PrivacyRule.Restricted);
    setAvailable(newAvailable);
  }, [privacySchema.modified])

  const addContract = () => {
    const idx = listContract.length;
    const contract: ContractData = {
      dataUsed: [],
      formula: {},
      name: `Contract ${listContract.length+1}`,
      contract: '',
      isError: false,
      errors: [],
      price: 0,
      currency: "FIL",
    }
    setListContract((prev) => ([...prev, contract]));
    setIndex(idx);
  }

  const setChosen = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.dataset && event.target.dataset.index !== undefined && event.target.dataset.name) {
      const idx = parseInt(event.target.dataset.index, 10);
      let oldContract = [...listContract];
      console.log(oldContract);
      let dataUsed;
      if (event.target.checked === false) {
        console.log('to remove:', event.target.dataset.name, oldContract[idx].dataUsed)
        dataUsed = oldContract[idx].dataUsed.filter((used) => event.target.dataset.name !== used)
        console.log("remove", dataUsed)
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
    {(listContract.length === 0) ?
      <Alert variant="soft">{t<string>('privacy.none')}</Alert>
      :
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
                <Chip
                  size="sm"
                  variant="soft"
                  color={index === idx ? 'primary' : 'neutral'}
                  sx={{ ml: 1 }}
                >
                  {contract.dataUsed.length}
                </Chip>
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
              height: '300px',
              px: 4,
              py: 2,
            })}
          >
            {listContract.map((contract, idx) => (
              <TabPanel key={`${contract.name}-panel`} value={idx}>
                <Stack spacing={1}>
                <CheckboxChip
                  label={t<string>('privacy.available')}
                  available={available}
                  idx={idx}
                  fields={contract.dataUsed}
                  setChosen={setChosen}
                />
                <InputPrice />
                </Stack>
              </TabPanel>
            ))}
          </Box>
        </Tabs>
      </Box>
    }

  </Stack>);
}

/*
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