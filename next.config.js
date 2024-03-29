/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'http',
                hostname: '127.0.0.1',
                port: '',
                pathname: '/api/static/*',
            },{
                protocol: 'http',
                hostname: 'localhost',
                port: '',
                pathname: '/api/static/*',
            },
        ],
    },
}

module.exports = nextConfig
