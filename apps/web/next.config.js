/** @type {import('next').NextConfig} */
const nextConfig = {
	// image optimize
	// images: {
	// 	unoptimized: true,
	// 	formats: ['image/webp'],
	// 	disableStaticImages: true,
	// },
	async rewrites() {
		return [
			{
				source: '/docs/:path*',
				destination: '/docs/:path*/index.html',
			},
		];
	},
};

module.exports = nextConfig;
