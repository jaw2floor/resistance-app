/** @type {import('next').NextConfig} */
const nextConfig = {
  // enable static export of all pages
  output: 'export',
  // if you use Next/Image, disable optimization for static export
  images: { unoptimized: true },
};
module.exports = nextConfig;
