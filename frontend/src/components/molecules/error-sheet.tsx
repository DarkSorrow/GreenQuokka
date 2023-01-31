import { useTranslation } from "react-i18next";
import Sheet from '@mui/joy/Sheet';
import Button from '@mui/joy/Button';
import { Link as RouterLink } from 'react-router-dom';

import HomeIcon from '@mui/icons-material/Home';
//import SmallButton from '../atoms/button-small';

export const ErrorNotFound = () => {
  const { t } = useTranslation();

  return (
    <Sheet
      sx={{
        width: 300,
        mx: 'auto', // margin left & right
        my: 4, // margin top & botom
        py: 3, // padding top & bottom
        px: 2, // padding left & right
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        borderRadius: 'sm',
        boxShadow: 'md',
      }}
      variant="outlined"
    >
      <div>{t<string>('notFound')}</div>
      <Button component={RouterLink} to="/" startDecorator={<HomeIcon />}>
        {t<string>('backhome')}
      </Button>
    </Sheet>
  );
}
//<SmallButton id={"home"} nav={"/"} label={t<string>('home')} handleClick={handleNavigation} color="secondary" />