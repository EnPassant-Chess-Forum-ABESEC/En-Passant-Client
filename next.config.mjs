/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  async redirects() {
    return [
      {
        source: '/sign-in',
        destination: '/auth/sign-in',
        permanent: true,
      },
      {
        source: '/sign-up',
        destination: '/auth/sign-up',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
