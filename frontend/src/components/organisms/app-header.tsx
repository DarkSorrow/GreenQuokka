import { Dispatch, SetStateAction } from 'react';
import Box from '@mui/joy/Box';
import Typography from '@mui/joy/Typography';
import Input from '@mui/joy/Input';
import IconButton from '@mui/joy/IconButton';

// Icons import
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import FindInPageRoundedIcon from '@mui/icons-material/FindInPageRounded';
import MenuIcon from '@mui/icons-material/Menu';
import BookRoundedIcon from '@mui/icons-material/BookRounded';

import { ThemeToggle } from '../atoms/theme-toggle';

interface OrganismsProp {
  setDrawerOpen: Dispatch<SetStateAction<boolean>>,
}

export const AppHeader = ({ setDrawerOpen }: OrganismsProp) => {
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
      </Box>
      <Input
        size="sm"
        placeholder="Search anything…"
        startDecorator={<SearchRoundedIcon color="primary" />}
        endDecorator={
          <IconButton variant="outlined" size="sm" color="neutral">
            <Typography fontWeight="lg" fontSize="sm" textColor="text.tertiary">
              /
            </Typography>
          </IconButton>
        }
        sx={{
          flexBasis: '500px',
          display: {
            xs: 'none',
            sm: 'flex',
          },
        }}
      />
      <Box sx={{ display: 'flex', flexDirection: 'row', gap: 1.5 }}>
        <IconButton
          size="sm"
          variant="outlined"
          color="primary"
          sx={{ display: { xs: 'inline-flex', sm: 'none' } }}
        >
          <SearchRoundedIcon />
        </IconButton>
        <IconButton
          size="sm"
          variant="outlined"
          color="primary"
          component="a"
          href="#"
        >
          <BookRoundedIcon />
        </IconButton>
        <ThemeToggle />
      </Box>
    </>
  );
}
