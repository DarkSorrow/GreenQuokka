import Typography from '@mui/joy/Typography';

interface AtomsProps {
  title: string;
  subtitle: string;
}

export const HeaderText = ({ title, subtitle }: AtomsProps) => {
  return (
    <div>
      <Typography level="h4" component="h1">
        <b>{title}</b>
      </Typography>
      <Typography level="body2">{subtitle}</Typography>
    </div>
  );
};
