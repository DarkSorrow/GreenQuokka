import Stack from '@mui/joy/Stack';

interface TemplateProps {
  topicsManagement: React.ReactNode,
  topicList: React.ReactNode,
}

export const AppSchemasTemplate = ({ topicsManagement, topicList }: TemplateProps) => {
  return (
    <Stack spacing={2} sx={{ width: '100%' }}>
      {topicsManagement}
      {topicList}
    </Stack>
  );
}
