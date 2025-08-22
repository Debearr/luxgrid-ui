import type { AppProps } from 'next/app';
import '../src/src/styles/tailwind.css';

export default function App({ Component, pageProps }: AppProps) {
	return <Component {...pageProps} />;
}