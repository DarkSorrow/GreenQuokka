import Typography from '@mui/joy/Typography';
import Card from '@mui/joy/Card';

interface AtomsProps {
  title: string;
  children: React.ReactNode;
}

export const AppCardTitle = ({ title, children }: AtomsProps) => {
  return (
    <Card>
      <Typography level="h2" fontSize="lg" id="card-description" mb={0.5}>
        {title}
      </Typography>
      {children}
    </Card>
  );
}