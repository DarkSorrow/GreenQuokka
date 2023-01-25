import { useEffect, useState } from 'react';
import { Routes, Route, Navigate } from "react-router-dom";

import { AppTemplate } from '../templates/app';
import { ErrorNotFound } from './error-not-found';
import { AppHomePage } from './app-home';
import { AppSchemasPage } from './app-schemas';

const pages = ['/', 'prices', 'contact'];
const userPages = ['signup', 'signin'];

export const AppPage = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <Routes>
      <Route path="/" element={
          <AppTemplate
            navigation={<div>App Page</div>}
            header={<div>App Header</div>}
            drawerOpen={drawerOpen}
            setDrawerOpen={setDrawerOpen}
          />
        }>
        <Route index element={<AppHomePage />} />
        <Route path="schemas/*" element={<AppSchemasPage />} />
        <Route
          path="*"
          element={<ErrorNotFound />}
        />
      </Route>
    </Routes>
  );
}
