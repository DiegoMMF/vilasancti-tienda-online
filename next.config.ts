export default {
  experimental: {
    inlineCss: true,
    useCache: true
  },
  async redirects() {
    return [
      {
        source: '/search/:collection',
        destination: '/category/:collection',
        permanent: true
      }
    ];
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [

      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**'
      },
      {
        protocol: 'https',
        hostname: '*.public.blob.vercel-storage.com',
        pathname: '/**'
      }
    ]
  }
};
