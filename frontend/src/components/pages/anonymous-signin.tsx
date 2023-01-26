import { useTranslation } from "react-i18next";
import Stack from '@mui/joy/Stack';
import { useNavigate } from "react-router-dom";
import { zodResolver } from '@hookform/resolvers/zod';
import { SubmitHandler } from 'react-hook-form';

import { IFormSignin, SignInSchema } from '../../types/Zod'
import { Form } from "../atoms/forms";
import { ControlInput } from "../atoms/control-input";
import { HeaderText } from '../atoms/header-text';
import { FooterTextLink } from '../atoms/footer-text-link';
import { AnonymousSignTemplate } from '../templates/anonymous-sign';
import { SubmitLoading } from "../atoms/submit-loading";
import { useAuth } from '../../providers/auth';

export const AnonymousSignin = () => {
  const { t } = useTranslation();
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const onSubmitHandler: SubmitHandler<IFormSignin> = async (values: IFormSignin) => {
    console.log(values);
    await signIn(new Date().toISOString());
    navigate('/');
  }
  return (
    <AnonymousSignTemplate
      header={<HeaderText 
        title={t<string>('welcome')}
        subtitle={t<string>('signin')}
      />}
      forms={<Form
        onSuccess={onSubmitHandler}
        resolver={zodResolver(SignInSchema)}
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
          <SubmitLoading label={t<string>('register')} />
        </Stack>
      </Form>}
      footer={<FooterTextLink
        linkText={t<string>('register')}
        text={t<string>('nologin')}
        href="/register"
      />}
    />
  );
};
