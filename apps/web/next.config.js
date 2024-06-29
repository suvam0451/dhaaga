/** @type {import('next').NextConfig} */
const nextConfig = {
	// image optimize
	images: {
		unoptimized: true,
		formats: ['image/webp'],
		disableStaticImages: true,
	},
};

module.exports = nextConfig;
