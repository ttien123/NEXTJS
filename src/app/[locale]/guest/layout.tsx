import React from 'react';
import Layout from '../(public)/layout';
import { defaultLocale } from '@/i18n/config';

const GuestLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <Layout modal={null} params={{ locale: defaultLocale }}>
      {children}
    </Layout>
  );
}

export default GuestLayout;
