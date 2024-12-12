/** @type {import('next').NextConfig} */
const nextConfig = {
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
        domains: ['github.com', 'localhost'], // Thêm github.com vào danh sách domain cho phép
    },
};

export default nextConfig;
