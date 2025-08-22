/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	async headers() {
		return [
			{
				source: '/(.*)',
				headers: [
					{ key: 'X-Council-Validated', value: 'true' },
					{ key: 'X-Brand-Compliant', value: 'luxury' },
				],
			},
		];
	},
};
export default nextConfig;