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
        domains: ['github.com', 'localhost','103.172.79.80'], // Thêm github.com vào danh sách domain cho phép
    },
};

export default nextConfig;
