import { MouseEventHandler } from "react";
import ListItem from '@mui/joy/ListItem';
import ListItemButton from '@mui/joy/ListItemButton';
import ListItemDecorator from '@mui/joy/ListItemDecorator';
import ListItemContent from '@mui/joy/ListItemContent';

interface AtomsProps {
  icon: React.ReactNode;
  text: string;
  onClick: MouseEventHandler<HTMLAnchorElement>;
}
// <ListItemButton variant="soft" color="primary">
export const AppListButton = ({ icon, text, onClick }: AtomsProps) => {
  return (
    <ListItem>
      <ListItemButton onClick={onClick}>
        <ListItemDecorator sx={{ color: 'inherit' }}>
          {icon}
        </ListItemDecorator>
        <ListItemContent>{text}</ListItemContent>
      </ListItemButton>
    </ListItem>
  );
};
