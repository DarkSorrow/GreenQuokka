import { useFormContext, Controller, get } from 'react-hook-form';
import FormControl from '@mui/joy/FormControl';
//import FormLabel from '@mui/joy/FormLabel';
import FormHelperText from '@mui/joy/FormHelperText';
import Input, { InputProps } from '@mui/joy/Input';
import { useTranslation } from "react-i18next";

type AtomsProps = {
  name: string;
  defaultValue?: string;
} & InputProps;

export const ControlInput = ({ name, defaultValue, ...otherProps }: AtomsProps) => {
  const {
    control,
    formState: { errors },
  } = useFormContext();
  const { t } = useTranslation();
  const error = get(errors, name);
  const isError = error !== undefined;

  return (
    <FormControl>
      <Controller
        control={control}
        name={name}
        defaultValue={defaultValue}
        render={({ field }) => (
          <Input
            {...field}
            {...otherProps}
            error={isError}
          />
        )}
      />
      <FormHelperText>{isError ? t<string>([`error.${error.message}`, error.message]) : ''}</FormHelperText>
    </FormControl>
  );
}
//helperText={isError ? t<string>([`error.front.${error.message}`, error.message]) : ''}
