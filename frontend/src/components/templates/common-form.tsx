import Stack from '@mui/joy/Stack';
import Grid from '@mui/joy/Grid';
interface TemplateProps {
  forms: React.ReactNode,
  submit: React.ReactNode,
}

export const CommonFormTemplate = ({ forms, submit }: TemplateProps) => {
  return (
    <Stack spacing={1}>
      {forms}
    </Stack>
  );
}
