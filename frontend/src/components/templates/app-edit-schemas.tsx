import Stack from '@mui/joy/Stack';
import Grid from '@mui/joy/Grid';
interface TemplateProps {
  title: React.ReactNode,
  schemaInfo: React.ReactNode,
  definition: React.ReactNode,
  iuDisplay: React.ReactNode,
  forms: React.ReactNode,
}

export const AppEditSchemaTemplate = ({ title, schemaInfo, definition, iuDisplay, forms } : TemplateProps) => {
  return (
    <Grid container spacing={2} sx={{ flexGrow: 1 }}>
      <Grid xs={12}>
        {title}
      </Grid>
      <Grid xs={12}>
        {schemaInfo}
      </Grid>
      <Grid xs={12} md={7}>
        <Stack spacing={2} sx={{ width: '100%' }}>
          {definition}
          {iuDisplay}
        </Stack>
      </Grid>
      <Grid xs={12} md={5}>
        {forms}
      </Grid>
    </Grid>
  );
}
