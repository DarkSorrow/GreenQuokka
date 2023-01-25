import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

//import SmallButton from '../atoms/button-small';

export const ErrorNotFound = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleNavigation = async (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    navigate('/');
  }
  return (
    <main>
      <div>Page not found</div>
    </main>
  );
}
//<SmallButton id={"home"} nav={"/"} label={t<string>('home')} handleClick={handleNavigation} color="secondary" />