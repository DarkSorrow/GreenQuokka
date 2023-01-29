import { useState } from 'react';
import { useTranslation } from "react-i18next";
import Stack from '@mui/joy/Stack';
import { useNavigate } from "react-router-dom";
import { zodResolver } from '@hookform/resolvers/zod';
import { SubmitHandler } from 'react-hook-form';
import Alert from '@mui/joy/Alert';
import Box from '@mui/joy/Box';

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
  const [error, setError] = useState('');
  const onSubmitHandler: SubmitHandler<IFormSignin> = async (values: IFormSignin) => {
    setError('');
    try {
      const response = await fetch('/Priv/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });
      const resp = await response.json();
      if (response.status === 200) {
        await signIn(resp.entities, resp.exp);
        navigate('/');
      } else {
        setError(`error.api.${resp.error}`);
      }
    } catch (err) {
      setError('error.api.Unknown');
    }
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
          pwd: '',
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
            name="pwd"
            data-testid="password"
            type="password"
            placeholder="Password"
          />
          {error && (<Box sx={{ width: '100%' }}>
            <Alert color="danger">{t<string>(error)}</Alert>
          </Box>)}
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
