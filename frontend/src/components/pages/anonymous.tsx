import { useState } from 'react';
import { Routes, Route } from "react-router-dom";

import { AnonymousTemplate } from '../templates/anonymous';
import { AnonymousNavigation } from '../organisms/anonymous-navigation';
import { AnonymousHeader } from '../organisms/anonymous-header';
// Page part displayed in the main screen
import { ErrorNotFound } from './error-not-found';
import { AnonymousHomePage } from './anonymous-home';
import { AnonymousContactPage } from './anonymous-contact';
import { AnonymousSignin } from './anonymous-signin';
import { AnonymousSignup } from './anonymous-signup';

export const AnonymousPage = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <Routes>
      <Route path="/" element={
          <AnonymousTemplate 
            navigation={<AnonymousNavigation />}
            header={<AnonymousHeader setDrawerOpen={setDrawerOpen} />}
            drawerOpen={drawerOpen}
            setDrawerOpen={setDrawerOpen}
          />
        }>
        <Route index element={<AnonymousHomePage />} />
        <Route path="connect" element={<AnonymousSignin />} />
        <Route path="register" element={<AnonymousSignup />} />
        <Route path="contact" element={<AnonymousContactPage />} />
        <Route
          path="*"
          element={<ErrorNotFound />}
        />
      </Route>
    </Routes>
  );
}

/*
  const [width, setWidth] = useState<number>(window.innerWidth);
  const handleWindowSizeChange = () => {
    setWidth(window.innerWidth);
  }
  useEffect(() => {
    window.addEventListener('resize', handleWindowSizeChange);
    return () => {
        window.removeEventListener('resize', handleWindowSizeChange);
    }
  }, []);


*/