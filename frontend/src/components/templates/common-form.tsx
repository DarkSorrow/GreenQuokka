import Grid from '@mui/joy/Grid';
interface TemplateProps {
  forms: React.ReactNode,
  submit: React.ReactNode,
}

export const CommonFormTemplate = ({ forms, submit }: TemplateProps) => {
  return (
    <Grid container spacing={1}>
      <Grid xs={12} md={8}>
        {forms}
      </Grid>
      <Grid xs={12} md={4}>
        {submit}
      </Grid>
    </Grid>
  );
}
