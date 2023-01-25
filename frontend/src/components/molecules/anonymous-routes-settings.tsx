import List, { ListProps } from '@mui/joy/List';
import ListItem from '@mui/joy/ListItem';
import ListItemButton from '@mui/joy/ListItemButton';
import ListItemContent from '@mui/joy/ListItemContent';
import ListItemDecorator from '@mui/joy/ListItemDecorator';
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import LoginIcon from '@mui/icons-material/Login';
import { useColorScheme } from '@mui/joy/styles';
import DarkModeRoundedIcon from '@mui/icons-material/DarkModeRounded';
import LightModeRoundedIcon from '@mui/icons-material/LightModeRounded';

export const AnonymousRoutesSettings = ({
  ...props
}: ListProps) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { mode, setMode } = useColorScheme();
  return (
    <List {...props}>
      <ListItem role="none">
        <ListItemButton
          role="menuitem" component="a" aria-label="Signin" color="info"
          onClick={() => navigate('/connect')}
        >
          <ListItemDecorator><LoginIcon color="info" /></ListItemDecorator>
          <ListItemContent>{t<string>('connect')}</ListItemContent>
        </ListItemButton>
      </ListItem>
      <ListItem role="none">
        <ListItemButton
          role="menuitem" aria-label="Theme" color="primary"
          onClick={() => setMode(mode === 'light' ? 'dark' : 'light')}
        >
          <ListItemDecorator>
            {mode === 'light' ? <DarkModeRoundedIcon /> : <LightModeRoundedIcon />}
          </ListItemDecorator>
        </ListItemButton>
      </ListItem>
    </List>
  );
};
