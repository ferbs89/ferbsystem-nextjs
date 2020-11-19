import Head from 'next/head';

import styles from '../styles/components/login.module.css';

export default function LoginLayout({ children, title }) {
	return (
		<div className={styles.container}>
			<Head>
				<title>{title} | Ferbsystem</title>
				<link rel="icon" href="/favicon.ico" />
			</Head>

			<div className={styles.content}>
				<div className={styles.logo}>
					<img src="/logo.png" alt="Ferbsystem" />
				</div>

				{children}
			</div>
		</div>
	)
}
