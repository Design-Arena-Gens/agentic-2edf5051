/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      allowedOrigins: ['localhost:3000', 'agentic-2edf5051.vercel.app']
    }
  }
};

export default nextConfig;
