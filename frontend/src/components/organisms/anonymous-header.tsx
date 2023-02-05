import { Dispatch, SetStateAction } from 'react';
import Box from '@mui/joy/Box';
import Typography from '@mui/joy/Typography';
import IconButton from '@mui/joy/IconButton';
import Divider from '@mui/joy/Divider';

// Icons import
import MenuIcon from '@mui/icons-material/Menu';

import { AnonymousRoutesLink } from '../molecules/anonymous-routes-link';
import { AnonymousRoutesSettings } from '../molecules/anonymous-routes-settings';
import LogoIcon from '../../logo.svg';

interface OrganismsProp {
  setDrawerOpen: Dispatch<SetStateAction<boolean>>,
}

export const AnonymousHeader = ({ setDrawerOpen }: OrganismsProp) => {
  return (
    <>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          gap: 1.5,
        }}
      >
        <IconButton
          variant="outlined"
          size="sm"
          onClick={() => setDrawerOpen(true)}
          sx={{ display: { sm: 'none' } }}
        >
          <MenuIcon />
        </IconButton>
        <IconButton
          size="sm"
          variant="solid"
          sx={{ display: { xs: 'none', sm: 'inline-flex' } }}
        >
          <img src={LogoIcon} height="24" width="24" alt="logo" />
        </IconButton>
        <Typography component="h1" fontWeight="xl">
          Green Quokka
        </Typography>
        <Divider orientation="vertical" />
      </Box>
      <Box component="nav" aria-label="My site" sx={{ flexGrow: 1 }}>
        <AnonymousRoutesLink
          role="menubar" sx={{ display: { xs: 'none', sm: 'inline-flex' } }} orientation="horizontal"
        />
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'row', gap: 1.5 }}>
        <AnonymousRoutesSettings orientation="horizontal" />
      </Box>
    </>
  );
}
