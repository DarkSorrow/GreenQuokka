import Sheet from '@mui/joy/Sheet';
import CircularProgress from '@mui/joy/CircularProgress';

export const LoadingSuspense = () => {
  return (
    <Sheet color="neutral" variant="soft">
      <CircularProgress
        determinate={false}
        size="lg"
        variant="soft"
      />
    </Sheet>
  );
};
