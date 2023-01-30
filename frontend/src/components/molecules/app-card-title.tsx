import Typography from '@mui/joy/Typography';
import Card, { CardProps } from '@mui/joy/Card';

type AtomsProps = {
  title: string;
  children: React.ReactNode;
} & CardProps;

export const AppCardTitle = ({ title, children, ...cardProps }: AtomsProps) => {
  return (
    <Card {...cardProps}>
      <Typography level="h2" fontSize="lg" id="card-description" mb={0.5}>
        {title}
      </Typography>
      {children}
    </Card>
  );
}