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
        domains: ['github.com'], // Thêm github.com vào danh sách domain cho phép
    },
};

export default nextConfig;
