/** @type {import('next').NextConfig} */
const nextConfig = {
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
	async rewrites() {
		return [
			{ source: '/api/auraFX/:path*', destination: '/api/auraFX/:path*' },
			{ source: '/api/noid/:path*', destination: '/api/noid/:path*' },
		];
	},
};

export default nextConfig;