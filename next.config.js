/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
          {
            protocol: 'https',
            hostname: 'cdn.pixabay.com',
            port: '',
            pathname: '/photo/**',
          },
          {
            protocol: 'https',
            hostname: 'imgix.ranker.com',
           
          },
        ],
      },
}

module.exports = nextConfig
