import Head from 'next/head';
import Link from 'next/link';
import { useFetch } from '../../hooks/useFetch';

import styles from '../../styles/Home.module.css'

export default function Users() {
	const { data, error } = useFetch('/api/users');

	if (error) return <div>failed to load</div>
	if (!data) return <div>loading...</div>

	return (
		<div className={styles.container}>
			<Head>
				<title>Usuários</title>
				<link rel="icon" href="/favicon.ico" />
			</Head>

			<main className={styles.main}>
				<h1 className={styles.title}>
					Usuários
				</h1>

				<div className={styles.grid}>
					{data.map(user => (
						<Link key={user._id} href={`/users/${user._id}`}>
							<a className={styles.card}>
								<h3>{user.name} &rarr;</h3>
								<p>{user.email}</p>
							</a>
						</Link>
					))}
				</div>

				<Link href="/">
					<a><h3>&larr; Voltar</h3></a>
				</Link>
			</main>

			<footer className={styles.footer}>
				<a
					href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
					target="_blank"
					rel="noopener noreferrer"
				>
					Powered by{' '}
					<img src="/vercel.svg" alt="Vercel Logo" className={styles.logo} />
				</a>
			</footer>
		</div>
	);
}
