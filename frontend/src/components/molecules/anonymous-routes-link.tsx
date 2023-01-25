import List, { ListProps } from '@mui/joy/List';
import ListItem from '@mui/joy/ListItem';
import ListItemButton from '@mui/joy/ListItemButton';
import ListItemContent from '@mui/joy/ListItemContent';
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

export const AnonymousRoutesLink = ({
  ...props
}: ListProps) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <List {...props}>
      <ListItem role="none">
        <ListItemButton role="menuitem"
          component="a" aria-label="Contact" 
          onClick={() => navigate('/')}
        >
          <ListItemContent>{t<string>('home')}</ListItemContent>
        </ListItemButton>
      </ListItem>
      <ListItem>
        <ListItemButton role="menuitem"
          component="a" aria-label="Contact" 
          onClick={() => navigate('/contact')}
        >
          <ListItemContent>{t<string>('contact')}</ListItemContent>
        </ListItemButton>
      </ListItem>
    </List>
  );
};
