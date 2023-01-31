import Grid from '@mui/joy/Grid';
interface TemplateProps {
  title: React.ReactNode,
  schemaInfo: React.ReactNode,
  definition: React.ReactNode,
  privacyDisplay: React.ReactNode,
  forms: React.ReactNode,
  submit: React.ReactNode,
}

export const AppEditSchemaTemplate = ({ title, schemaInfo, definition, privacyDisplay, forms, submit } : TemplateProps) => {
  return (
    <Grid container spacing={2} sx={{ flexGrow: 1 }}>
      <Grid xs={12}>
        {title}
      </Grid>
      <Grid xs={12}>
        {schemaInfo}
      </Grid>
      <Grid xs={12} md={7}>
        {definition}
      </Grid>
      <Grid xs={12} md={5}>
        {forms}
      </Grid>
      <Grid xs={12}>
        {privacyDisplay}
      </Grid>
      <Grid xs={12} sx={{ textAlign: 'center', pb: 10 }}>
        {submit}
      </Grid>
    </Grid>
  );
}
