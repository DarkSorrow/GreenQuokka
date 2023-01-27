import Box from '@mui/joy/Box';
import IconButton from '@mui/joy/IconButton';
import List from '@mui/joy/List';
import ListSubheader from '@mui/joy/ListSubheader';
import ListItem from '@mui/joy/ListItem';
import ListItemButton from '@mui/joy/ListItemButton';
import ListItemDecorator from '@mui/joy/ListItemDecorator';
import ListItemContent from '@mui/joy/ListItemContent';
import { useTranslation } from "react-i18next";

// Icons import
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import ShareOutlinedIcon from '@mui/icons-material/ShareOutlined';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import LogoutIcon from '@mui/icons-material/Logout';

import { AppNavLink } from '../atoms/app-nav-link';
import { AppListButton } from '../atoms/app-list-button';
import { AppLangMenu } from '../atoms/app-lang-menu';
import { useAuth } from '../../providers/auth';

export const AppNavigation = () => {
  const { t } = useTranslation();
  const { signOut } = useAuth();
  
  return (
    <List size="sm" sx={{ '--List-item-radius': '8px', '--List-gap': '4px' }}>
      <ListItem nested>
        <ListSubheader>
          {t<string>('app')}
          <IconButton
            size="sm"
            variant="plain"
            color="primary"
            sx={{ '--IconButton-size': '24px', ml: 'auto' }}
          >
            <KeyboardArrowDownRoundedIcon fontSize="sm" color="primary" />
          </IconButton>
        </ListSubheader>
        <List
          aria-labelledby="nav-list-browse"
          sx={{
            '& .JoyListItemButton-root': { p: '8px' },
          }}
        >
          <AppNavLink 
            icon={<FolderOpenIcon fontSize="sm" />}
            text={t<string>('dashboard')}
            href="/"
          />
          <AppNavLink 
            icon={<ShareOutlinedIcon fontSize="sm" />}
            text={t<string>('schema')}
            href="/schemas"
          />
          <AppNavLink 
            icon={<DeleteRoundedIcon fontSize="sm" />}
            text={t<string>('market')}
            href="/market"
          />
        </List>
      </ListItem>
      <ListItem nested sx={{ mt: 2 }}>
        <ListSubheader>
          {t<string>('settings')}
          <IconButton
            size="sm"
            variant="plain"
            color="primary"
            sx={{ '--IconButton-size': '24px', ml: 'auto' }}
          >
            <KeyboardArrowDownRoundedIcon fontSize="sm" color="primary" />
          </IconButton>
        </ListSubheader>
        <List
          aria-labelledby="action-list"
          sx={{
            '& .JoyListItemButton-root': { p: '8px' },
          }}
        >
          <AppNavLink 
            icon={<DeleteRoundedIcon fontSize="sm" />}
            text={t<string>('profile')}
            href="/profile"
          />
          <AppLangMenu />
          <AppListButton 
            icon={<LogoutIcon fontSize="sm" />}
            text={t<string>('logout')}
            onClick={() => {
              console.log('logout');
              signOut();
            }}
          />
          <ListItem>
            <ListItemButton>
              <ListItemDecorator>
                <Box
                  sx={{
                    width: '10px',
                    height: '10px',
                    borderRadius: '99px',
                    bgcolor: 'warning.500',
                  }}
                />
              </ListItemDecorator>
              <ListItemContent>{t<string>('lang')}</ListItemContent>
            </ListItemButton>
          </ListItem>
          <ListItem>
            <ListItemButton>
              <ListItemDecorator>
                <Box
                  sx={{
                    width: '10px',
                    height: '10px',
                    borderRadius: '99px',
                    bgcolor: 'success.400',
                  }}
                />
              </ListItemDecorator>
              <ListItemContent>{t<string>('logout')}</ListItemContent>
            </ListItemButton>
          </ListItem>
        </List>
      </ListItem>
    </List>
  );
}
