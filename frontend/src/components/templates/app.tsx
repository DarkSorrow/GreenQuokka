import { Dispatch, SetStateAction } from 'react';
import { Outlet } from "react-router-dom";

import { LayoutRoot } from '../atoms/layout-root';
import { LayoutHeader } from '../atoms/layout-header';
import { LayoutSideNav } from '../atoms/layout-sidenav';
import { LayoutMain } from '../atoms/layout-main';
import { LayoutSideDrawer } from '../atoms/layout-sidedrawer';

interface TemplateProps {
  navigation: React.ReactNode,
  header: React.ReactNode,
  drawerOpen: boolean,
  setDrawerOpen: Dispatch<SetStateAction<boolean>>,
}

export const AppTemplate = ({ navigation, header, drawerOpen, setDrawerOpen }: TemplateProps) => {
  
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
            sm: 'minmax(64px, 200px) minmax(450px, 1fr)',
            md: 'minmax(160px, 300px) minmax(600px, 1fr) minmax(300px, 420px)',
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
        <LayoutSideNav>
          {navigation}
        </LayoutSideNav>
        <LayoutMain>
          <Outlet />
        </LayoutMain>
      </LayoutRoot>
    </>
  );
}
