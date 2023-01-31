import { useState } from 'react';
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import Stack from '@mui/joy/Stack';
import { zodResolver } from '@hookform/resolvers/zod';
import { SubmitHandler } from 'react-hook-form';
import Alert from '@mui/joy/Alert';
import Box from '@mui/joy/Box';

import { IFormSignup, SignUpSchema } from '../../types/Zod'
import { Form } from "../atoms/forms";
import { ControlInput } from "../atoms/control-input";
import { SelectCountry } from "../atoms/select-country";
import { HeaderText } from '../atoms/header-text';
import { FooterTextLink } from '../atoms/footer-text-link';
import { AnonymousSignTemplate } from '../templates/anonymous-sign';
import { SubmitLoading } from "../atoms/submit-loading";
import { useAuth } from '../../providers/auth';

export const AnonymousSignup = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const [error, setError] = useState('');

  const onSubmitHandler: SubmitHandler<IFormSignup> = async (values: IFormSignup) => {
    setError('');
    try {
      const response = await fetch('/Priv/signup', {
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
        subtitle={t<string>('signup')}
      />}
      forms={
        <Form
          onSuccess={onSubmitHandler}
          resolver={zodResolver(SignUpSchema)}
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
          <SelectCountry
            name="country"
            data-testid="country"
          />
          {error && (<Box sx={{ width: '100%' }}>
            <Alert color="danger">{t<string>(error)}</Alert>
          </Box>)}
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
