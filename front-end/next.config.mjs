const nextConfig = {
    trailingSlash: false,
    async redirects() {
        return [
            {
                source: '/admin',
                destination: '/admin/login',
                permanent: true,
            },
        ];
    },
    images: {
        domains: ['github.com', 'localhost', '103.172.79.80', 'edumaster-qzld.onrender.com'],
    },
};

export default nextConfig;
