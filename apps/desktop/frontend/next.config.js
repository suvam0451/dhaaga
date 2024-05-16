/** @type {import('next').NextConfig} */

const nextConfig = {
	reactStrictMode: true,
	// Wails' development web server does not support gzip compression,
	// turning on gzip compression will result in a blank screen when
	// running `wails dev`, so we need to turn off Next.js' gzip compression.
	// See <https://nextjs.org/docs/api-reference/next.config.js/compression>.
	compress: false,
	output: "export"
};
export default nextConfig