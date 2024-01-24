/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'http',
                hostname: '127.0.0.1',
                port: '',
                pathname: '/api/static/chat3.5.png',
            },{
                protocol: 'http',
                hostname: '127.0.0.1',
                port: '',
                pathname: '/api/static/chat.png',
            },
        ],
    },
}

module.exports = nextConfig
