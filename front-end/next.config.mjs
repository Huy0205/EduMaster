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
        domains: ['github.com', 'localhost', 'res.cloudinary.com', 'edumaster-qzld.onrender.com'],
    },
};

export default nextConfig;
