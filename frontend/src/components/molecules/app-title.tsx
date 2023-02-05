import Card from '@mui/joy/Card';
import Typography from '@mui/joy/Typography';

interface MoleculeProps {
  title: string;
  subtitle: string;
}

export const AppTitle = ({ title, subtitle }: MoleculeProps) => {
  return (<Card
    variant="outlined"
    orientation="horizontal"
    sx={{
      width: '100%',
      gap: 2,
    }}
  >
    <div>
      <Typography level="h2" fontSize="lg" id="card-description" mb={0.5}>
        {title}
      </Typography>
      <Typography fontSize="sm" aria-describedby="card-description" mb={1} sx={{ color: 'text.tertiary' }}>
        {subtitle}
      </Typography>
    </div>
  </Card>);
}