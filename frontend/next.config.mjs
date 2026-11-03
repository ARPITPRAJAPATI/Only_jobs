/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: { ignoreDuringBuilds: true },
  images: { remotePatterns: [{ protocol: 'https', hostname: '**' }] },
  async redirects() {
    return [
      {
        source: '/overview',
        destination: '/profile',
        permanent: false,
      },
      {
        source: '/certificate',
        destination: '/certifications',
        permanent: false,
      },
      {
        source: '/certificates',
        destination: '/certifications',
        permanent: false,
      },
      {
        source: '/coding-activities',
        destination: '/coding',
        permanent: false,
      },
      {
        source: '/coding-activity',
        destination: '/coding',
        permanent: false,
      },
      {
        source: '/academics-sgpa',
        destination: '/academics',
        permanent: false,
      },
      {
        source: '/sgpa',
        destination: '/academics',
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
