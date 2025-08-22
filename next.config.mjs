/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	// If you need custom headers, define them here (not in vercel.json):
	// async headers() { return [{ source: '/(.*)', headers: [{ key: 'X-Council-Validated', value: 'true' }, { key: 'X-Brand-Compliant', value: 'luxury' }] }]; }
};
export default nextConfig;