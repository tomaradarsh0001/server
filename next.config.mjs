// next.config.mjs
const ContentSecurityPolicy = `
  default-src 'self';
  script-src 'self' 'unsafe-inline' 'unsafe-eval' https://ldo.mohua.gov.in ;
  style-src 'self' 'unsafe-inline' https://ldo.mohua.gov.in https://fonts.googleapis.com;
  img-src 'self' data: https://ldo.mohua.gov.in ;
  font-src 'self' data: https://ldo.mohua.gov.in  https://fonts.googleapis.com https://fonts.gstatic.com;
  connect-src 'self' https://ldo.mohua.gov.in  https://api.ipify.org https://nominatim.openstreetmap.org;
  frame-src https://www.google.com;
`;

const securityHeaders = [
  {
    key: 'Content-Security-Policy',
    value: ContentSecurityPolicy.replace(/\s{2,}/g, ' ').trim(),
  },
  {
    key: 'Permissions-Policy',
    value: 'geolocation=(self)',
  },
   {
    key: 'Cache-Control',
    value: 'no-cache, no-store, must-revalidate',
  },
  {
    key: 'Pragma',
    value: 'no-cache',
  },
];

const nextConfig = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: securityHeaders,
      }
    ];
  },
  images: {
    domains: ['ldo.mohua.gov.in'],
    unoptimized: true,
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://ldo.mohua.gov.in/api/:path*',
      },
      {
        source: '/api/:path*',
        destination: 'https://ldo.mohua.gov.in/api/:path*',
      },
    ];
  },
  compiler: {
    styledComponents: {
      cssProp: true,
    },
  },
  reactStrictMode: false,
};

export default nextConfig;
