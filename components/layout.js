import Head from 'next/head';
import useUser from '../hooks/useUser';

import Header from './header';
import Menu from './menu';

export default function Layout({ children, title }) {
	const { user } = useUser();

	return (
		<>
			<Head>
				<title>{title} | Ferbsystem</title>
				<link rel="icon" href="/favicon.ico" />
				<meta name="theme-color" content="#17496E" />
			</Head>

			{user?.isLoggedIn && (
				<div className="container">
					<Header />

					<Menu />

					{children}
				</div>
			)}
		</>
	)
}
