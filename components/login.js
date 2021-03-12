import Head from 'next/head';

import styles from '../styles/components/login.module.css';

export default function LoginLayout({ children, title }) {
	return (
		<div className={styles.container}>
			<Head>
				<title>{title} | Ferbsystem</title>
				<link rel="icon" href="/favicon.ico" />
				<meta name="theme-color" content="#17496E" />
			</Head>

			<div className={styles.content}>
				<div className={styles.logo}>
					<img src="/lunaris.png" alt="Ferbsystem" />
					<span>Lunaris</span>
				</div>

				{children}
			</div>
		</div>
	)
}
