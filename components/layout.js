import Head from 'next/head';

import Header from './header';
import Menu from './menu';

export default function Layout({ children, title }) {
	return (
		<div className="container">
			<Head>
				<title>{title} | Ferbsystem</title>
				<link rel="icon" href="/favicon.ico" />
				<meta name="theme-color" content="#17496E" />
			</Head>

			<Header />

			<Menu />

			{children}
		</div>
	)
}
