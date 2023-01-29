/* eslint-disable react-hooks/exhaustive-deps */
import * as React from 'react';
import { useTranslation } from "react-i18next";
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import Autocomplete, { createFilterOptions } from '@mui/joy/Autocomplete';
import AutocompleteOption from '@mui/joy/AutocompleteOption';
import CircularProgress from '@mui/joy/CircularProgress';
import Modal from '@mui/joy/Modal';
import ModalDialog from '@mui/joy/ModalDialog';
import Button from '@mui/joy/Button';
import Input from '@mui/joy/Input';
import Typography from '@mui/joy/Typography';
import Stack from '@mui/joy/Stack';

import { useAuth } from '../../providers/auth';

export interface TopicList {
  inputValue?: string;
  topics: string;
  count: number;
}
const filter = createFilterOptions<TopicList>();

interface TopicListProps {
  value: TopicList | null;
  setValue: React.Dispatch<React.SetStateAction<TopicList | null>>;
}

export const SelectTopicList = ({ value, setValue }: TopicListProps) => {
  const { t } = useTranslation();
  const { userToken } = useAuth();
  const [open, setOpen] = React.useState(false);
  const [options, setOptions] = React.useState<TopicList[] | null>(null);
  const loading = open && options === null;
  const [openToggle, toggleOpen] = React.useState(false);
  const [dialogValue, setDialogValue] = React.useState({
    topic: '',
  });

  const getTopics = async (active: boolean) => {
    let topics: TopicList[] = [];
    try {
      const response = await fetch('/api/v1/topic', {
        method: 'GET',
        headers: {
          "X-Quokka-Token": userToken ?? '',
        }
      });
      const resp = await response.json();
      console.log(resp)
      if (response.status === 200) {
        topics = resp.data;
      } else {
        console.log(response.status);
      }
    } catch (err)  {
      console.log(err);
    }
    if (active) {
      setOptions([...topics]);
    }
  }

  /*React.useEffect(() => {
    let active = true;
    if (!loading) {
      return undefined;
    }
    getTopics(active);
    return () => {
      active = false;
    };
  }, [loading, userToken]);*/

  React.useEffect(() => {
    getTopics(true);
  }, []);

  const handleClose = () => {
    setDialogValue({
      topic: '',
    });

    toggleOpen(false);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setValue({
      topics: dialogValue.topic,
      count: 0,
    });
    try {
      const body = {
        topics: dialogValue.topic,
        count: 0,
      };
      await fetch('/api/v1/topic', {
        method: 'POST',
        headers: {
          "X-Quokka-Token": userToken ?? '',
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });
      if (options) {
        setOptions([...options, ...[body]]);
      } else {
        setOptions([body])
      }
      
    } catch (err)  {
      console.log(err);
    }
    handleClose();
  };

  return (
    <>
    <FormControl id="select-topic">
      <Autocomplete
        sx={{ width: 300 }}
        placeholder={t<string>('pschema.topic')}
        open={open}
        value={value}
        onChange={(event, newValue) => {
          if (typeof newValue === 'string') {
            // timeout to avoid instant validation of the dialog's form.
            setTimeout(() => {
              toggleOpen(true);
              setDialogValue({
                topic: newValue,
              });
            });
          } else if (newValue && newValue.inputValue) {
            toggleOpen(true);
            setDialogValue({
              topic: newValue.inputValue,
            });
          } else {
            setValue(newValue);
          }
        }}
        filterOptions={(options, params) => {
          const filtered = filter(options, params);

          if (params.inputValue !== '') {
            filtered.push({
              inputValue: params.inputValue,
              topics: `Add "${params.inputValue}"`,
              count: 0,
            });
          }

          return filtered;
        }}
        onOpen={() => {
          setOpen(true);
        }}
        onClose={() => {
          setOpen(false);
        }}
        isOptionEqualToValue={(option, value) => option.topics === value.topics}
        getOptionLabel={(option) => {
          // e.g value selected with enter, right from the input
          if (typeof option === 'string') {
            return option;
          }
          if (option.inputValue) {
            return option.inputValue;
          }
          return option.topics;
        }}
        freeSolo
        options={options ?? []}
        loading={loading}
        renderOption={(props, option) => (
          <AutocompleteOption {...props}>{option.topics}</AutocompleteOption>
        )}
      />
    </FormControl>
    <Modal open={openToggle} onClose={handleClose}>
      <ModalDialog>
        <form onSubmit={handleSubmit}>
          <Typography
            id="basic-modal-dialog-title"
            component="h2"
            level="inherit"
            fontSize="1.25em"
            mb="0.25em"
          >
            {t<string>('pschema.addTopic')}
          </Typography>
          <Typography
            id="basic-modal-dialog-description"
            mt={0.5}
            mb={2}
            textColor="text.tertiary"
          >
            {t<string>('pschema.descTopic')}
          </Typography>
          <Stack spacing={2}>
            <FormControl id="name">
              <FormLabel>{t<string>('topic')}</FormLabel>
              <Input
                autoFocus
                type="text"
                value={dialogValue.topic}
                onChange={(event) =>
                  setDialogValue({
                    ...dialogValue,
                    topic: event.target.value,
                  })
                }
              />
            </FormControl>
            <Stack direction="row" justifyContent="flex-end" spacing={2}>
              <Button variant="plain" color="neutral" onClick={handleClose}>
                {t<string>('cancel')}
              </Button>
              <Button type="submit">{t<string>('add')}</Button>
            </Stack>
          </Stack>
        </form>
      </ModalDialog>
    </Modal>
    </>
  );
}
