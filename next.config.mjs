/** @type {import('next').NextConfig} */
const nextConfig = {
    typescript: {
        ignoreBuildErrors: true,
    },
    images: {
        domains: ['uvyucvvkbpfymrqgozty.supabase.co', 'lh3.googleusercontent.com', 'airtable.com'],
    },
    async headers() {
        return [
            {
                source: "/:path*",
                headers: [
                    {
                        key: "Content-Security-Policy",
                        value: "frame-src 'self' https://airtable.com;",
                    },
                ],
            },
        ];
    },
};

export default nextConfig;
