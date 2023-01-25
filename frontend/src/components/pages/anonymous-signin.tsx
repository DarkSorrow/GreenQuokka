import { HeaderText } from '../atoms/header-text';
import { FooterTextLink } from '../atoms/footer-text-link';
import { AnonymousSignTemplate } from '../templates/anonymous-sign';
import { useTranslation } from "react-i18next";

export const AnonymousSignin = () => {
  const { t } = useTranslation();

  return (
    <AnonymousSignTemplate
      header={<HeaderText 
        title={t<string>('welcome')}
        subtitle={t<string>('signin')}
      />}
      forms={<div>test</div>}
      footer={<FooterTextLink
        linkText={t<string>('register')}
        text={t<string>('nologin')}
        href="/register"
      />}
    />
  );
};
