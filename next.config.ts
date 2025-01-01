import type { NextConfig } from 'next';
import createNextIntlPlugin  from 'next-intl/plugin';
const withNextIntl = createNextIntlPlugin();
const nextConfig: NextConfig = {
    images: {
        remotePatterns: [
          {
            protocol: 'http',
            hostname: 'localhost',
            port: '4000',
            pathname: '/**',
          },
          {
            hostname: 'via.placeholder.com',
            pathname: '/**',
          }
        ],
      },
};

export default withNextIntl(nextConfig);
