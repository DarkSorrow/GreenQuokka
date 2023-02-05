import * as React from 'react';
import AspectRatio from '@mui/joy/AspectRatio';
import Grid from '@mui/joy/Grid';
import Avatar from '@mui/joy/Avatar';
import Box from '@mui/joy/Box';
import Card from '@mui/joy/Card';
import CardOverflow from '@mui/joy/CardOverflow';
import Link from '@mui/joy/Link';
import IconButton from '@mui/joy/IconButton';
import Input from '@mui/joy/Input';
import Typography from '@mui/joy/Typography';
import MoreHoriz from '@mui/icons-material/MoreHoriz';
import FavoriteBorder from '@mui/icons-material/FavoriteBorder';
import ModeCommentOutlined from '@mui/icons-material/ModeCommentOutlined';
import SendOutlined from '@mui/icons-material/SendOutlined';
import Face from '@mui/icons-material/Face';
import BookmarkBorderRoundedIcon from '@mui/icons-material/BookmarkBorderRounded';

interface MolecileProps {
  contract: string;
}
const CardContract = ({ contract }: MolecileProps) => {
  return (<Card
    variant="outlined"
    sx={{
      minWidth: 300,
      '--Card-radius': (theme) => theme.vars.radius.xs,
    }}
  >
    <Box sx={{ display: 'flex', alignItems: 'center', pb: 1.5, gap: 1 }}>
      <Typography fontWeight="lg">StorageProvider</Typography>
      {/*<IconButton variant="plain" color="neutral" size="sm" sx={{ ml: 'auto' }}>
        <MoreHoriz />
      </IconButton>*/}
    </Box>
    <CardOverflow>
      <AspectRatio>
        <img src="/green-quokka.svg" alt="" loading="lazy" />
      </AspectRatio>
    </CardOverflow>
    <Box sx={{ display: 'flex', alignItems: 'center', mx: -1, my: 1 }}>
      <Box sx={{ width: 0, display: 'flex', gap: 0.5 }}>
        <IconButton variant="plain" color="neutral" size="sm">
          <FavoriteBorder />
        </IconButton>
        <IconButton variant="plain" color="neutral" size="sm">
          <ModeCommentOutlined />
        </IconButton>
        <IconButton variant="plain" color="neutral" size="sm">
          <SendOutlined />
        </IconButton>
      </Box>
    </Box>
    <Link
      component="button"
      underline="none"
      fontSize="sm"
      fontWeight="lg"
      textColor="text.primary"
    >
      StorageAsk: 10FIL=32GB
    </Link>
    <Typography fontSize="sm">
      <Link
        component="button"
        color="neutral"
        fontWeight="lg"
        textColor="text.primary"
      >
        StorageMarketActor
      </Link>{' '}
      Informations
    </Typography>
    <Link
      component="button"
      underline="none"
      fontSize="sm"
      startDecorator="…"
      sx={{ color: 'text.tertiary' }}
    >
      more
    </Link>
    <Link
      component="button"
      underline="none"
      fontSize="10px"
      sx={{ color: 'text.tertiary', my: 0.5 }}
    >
      2 DAYS AGO
    </Link>
    <CardOverflow sx={{ p: 'var(--Card-padding)', display: 'flex' }}>
      
      <Input
        startDecorator={<Typography>FIL</Typography>}
        variant="plain"
        size="sm"
        placeholder="Enter FIL amount..."
        sx={{ flexGrow: 1, mr: 1, '--Input-focusedThickness': '0px' }}
      />
      <Link disabled underline="none" role="button">
        StorageDealProposal
      </Link>
    </CardOverflow>
  </Card>)
}

interface MoleculeProps {
  contracts: string[];
}

export const AppStorageContracts = ({ contracts }: MoleculeProps) => {
  return (<Grid
    container
    direction="row"
    justifyContent="flex-start"
    alignItems="flex-start"
  >
    {contracts.map((address) => (
      <Grid key={`storage-${address}`}>
        <CardContract contract={address} />
      </Grid>
    ))}
  </Grid>);
}