/** @type {import('next').NextConfig} */
const nextConfig = {
	async headers() {
		return [
			{
				source: '/:path*',
				headers: [
					{ key: 'X-Council-Validated', value: 'true' },
					{ key: 'X-Brand-Compliant', value: 'luxury-street' },
				],
			},
		];
	},
};

module.exports = nextConfig;