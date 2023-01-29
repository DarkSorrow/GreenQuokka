import Stack from '@mui/joy/Stack';

interface TemplateProps {
  title: React.ReactNode,
  forms: React.ReactNode,
}

export const AppEditSchemaTemplate = ({ title, forms} : TemplateProps) => {
  return (
    <Stack spacing={2} sx={{ width: '100%' }}>
      {title}
      {forms}
    </Stack>
  );
}
