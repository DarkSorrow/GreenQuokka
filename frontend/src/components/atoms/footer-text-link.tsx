import Typography from '@mui/joy/Typography';
import Link from '@mui/joy/Link';
import { Link as RouterLink } from 'react-router-dom';

interface AtomsProps {
  linkText: string;
  text: string;
  href: string;
}

export const FooterTextLink = ({ linkText, text, href }: AtomsProps) => {
  return (
    <Typography
      endDecorator={<Link component={RouterLink} to={href}>{linkText}</Link>}
      fontSize="small"
      sx={{ alignSelf: 'center' }}
    >
      {text}
    </Typography>
  );
};
