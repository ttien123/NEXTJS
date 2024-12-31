import React from 'react';
import Layout from '../(public)/layout';

const GuestLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <Layout modal={null}>
      {children}
    </Layout>
  );
}

export default GuestLayout;
