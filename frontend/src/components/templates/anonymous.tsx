import { Dispatch, SetStateAction, useState } from 'react';
import { Outlet } from "react-router-dom";

import { LayoutRoot } from '../atoms/layout-root';
import { LayoutHeader } from '../atoms/layout-header';
import { LayoutMain } from '../atoms/layout-main';
import { LayoutSideDrawer } from '../atoms/layout-sidedrawer';

interface TemplateProps {
  navigation: React.ReactNode,
  header: React.ReactNode,
  drawerOpen: boolean,
  setDrawerOpen: Dispatch<SetStateAction<boolean>>,
}

export const AnonymousTemplate = ({ navigation, header, drawerOpen, setDrawerOpen }: TemplateProps) => {

  return (
    <>
      {drawerOpen && (
        <LayoutSideDrawer onClose={() => setDrawerOpen(false)}>
          {navigation}
        </LayoutSideDrawer>
      )}
      <LayoutRoot
        sx={{
          gridTemplateColumns: {
            xs: '1fr',
          },
          ...(drawerOpen && {
            height: '100vh',
            overflow: 'hidden',
          }),
        }}
      >
        <LayoutHeader>
          {header}
        </LayoutHeader>
        <LayoutMain>
          <Outlet />
        </LayoutMain>
      </LayoutRoot>
    </>
  );
}
