import Button from '@mui/joy/Button';
import { useFormContext } from 'react-hook-form';

interface AtomsProps {
  label: string;
}

export const SubmitLoading = ({ label }: AtomsProps) => {
  const {
    formState: { isSubmitting },
  } = useFormContext();

  return (
    <Button type='submit' loading={isSubmitting}>{label}</Button>
  );
}