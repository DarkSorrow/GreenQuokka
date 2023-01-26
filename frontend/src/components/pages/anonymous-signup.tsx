import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import Stack from '@mui/joy/Stack';
import { zodResolver } from '@hookform/resolvers/zod';
import { SubmitHandler } from 'react-hook-form';

import { IFormSignup, SignUpSchema } from '../../types/Zod'
import { Form } from "../atoms/forms";
import { ControlInput } from "../atoms/control-input";
import { SelectCountry } from "../atoms/select-country";
import { HeaderText } from '../atoms/header-text';
import { FooterTextLink } from '../atoms/footer-text-link';
import { AnonymousSignTemplate } from '../templates/anonymous-sign';
import { SubmitLoading } from "../atoms/submit-loading";

export const AnonymousSignup = () => {
  const { t } = useTranslation();

  const onSubmitHandler: SubmitHandler<IFormSignup> = async (values: IFormSignup) => {
    console.log(values);
  }

  return (
    <AnonymousSignTemplate
      header={<HeaderText 
        title={t<string>('welcome')}
        subtitle={t<string>('signup')}
      />}
      forms={
        <Form
          onSuccess={onSubmitHandler}
          resolver={zodResolver(SignUpSchema)}
          defaultValues={{
            email: '',
            password: '',
            country: 'FR'
          }}
        >
          <Stack spacing={2} sx={{ width: '100%' }}>
          <ControlInput
            required
            name="email"
            data-testid="email"
            placeholder="johndoe@test.com"
          />
          <ControlInput
            required
            name="password"
            data-testid="password"
            type="password"
            placeholder="Password"
          />
          <SelectCountry
            name="country"
            data-testid="country"
          />
          <SubmitLoading label={t<string>('register')} />
          </Stack>
        </Form>
      }
      footer={<FooterTextLink
        linkText={t<string>('login')}
        text={t<string>('account')}
        href="/connect"
      />}
    />
  );
};
