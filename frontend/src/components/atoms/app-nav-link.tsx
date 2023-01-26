
import ListItem from '@mui/joy/ListItem';
import ListItemButton from '@mui/joy/ListItemButton';
import ListItemDecorator from '@mui/joy/ListItemDecorator';
import ListItemContent from '@mui/joy/ListItemContent';
import { Link as RouterLink } from 'react-router-dom';

interface AtomsProps {
  icon: React.ReactNode;
  text: string;
  href: string;
}
// <ListItemButton variant="soft" color="primary">
export const AppNavLink = ({ icon, text, href }: AtomsProps) => {
  return (
    <ListItem>
      <ListItemButton component={RouterLink} to={href}>
        <ListItemDecorator sx={{ color: 'inherit' }}>
          {icon}
        </ListItemDecorator>
        <ListItemContent>{text}</ListItemContent>
      </ListItemButton>
    </ListItem>
  );
};
