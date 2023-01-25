import { Dispatch, SetStateAction } from 'react';
import Box from '@mui/joy/Box';
import Typography from '@mui/joy/Typography';
import IconButton from '@mui/joy/IconButton';
import Divider from '@mui/joy/Divider';
import Sheet from '@mui/joy/Sheet';
import List from '@mui/joy/List';
import ListItem from '@mui/joy/ListItem';
import ListItemButton from '@mui/joy/ListItemButton';
import ListItemContent from '@mui/joy/ListItemContent';
import ListItemDecorator from '@mui/joy/ListItemDecorator';
import Home from '@mui/icons-material/Home';
import ContactPageIcon from '@mui/icons-material/ContactPage';
import LoginIcon from '@mui/icons-material/Login';
import { useNavigate } from "react-router-dom";

// Icons import
import FindInPageRoundedIcon from '@mui/icons-material/FindInPageRounded';
import MenuIcon from '@mui/icons-material/Menu';

import { ThemeToggle } from '../atoms/theme-toggle';
import { AnonymousRoutesLink } from '../molecules/anonymous-routes-link';
import { AnonymousRoutesSettings } from '../molecules/anonymous-routes-settings';

interface OrganismsProp {
  setDrawerOpen: Dispatch<SetStateAction<boolean>>,
}

export const AnonymousHeader = ({ setDrawerOpen }: OrganismsProp) => {
  const navigate = useNavigate();
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
          <FindInPageRoundedIcon />
        </IconButton>
        <Typography component="h1" fontWeight="xl">
          Green Quokka
        </Typography>
        <Divider orientation="vertical" />
      </Box>
      <Box component="nav" aria-label="My site" sx={{ flexGrow: 1 }}>
        <AnonymousRoutesLink
          role="menubar" sx={{ display: { xs: 'none', sm: 'inline-flex' } }} row
        />
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'row', gap: 1.5 }}>
        <AnonymousRoutesSettings row />
      </Box>
    </>
  );
}