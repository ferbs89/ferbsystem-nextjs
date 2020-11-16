import Head from 'next/head';
import Link from 'next/link';
import { useFetch } from '../hooks/useFetch';

export default function Users() {
	const { data, error } = useFetch('/api/users');

	if (error) return <div className="main"><p className="title">failed to load</p></div>
	if (!data) return <div className="main"><p className="title">loading...</p></div>

	return (
		<>
			<Head>
				<title>Usuários</title>
				<link rel="icon" href="/favicon.ico" />
			</Head>

			<main className="main">
				<h1 className="title">
					Usuários
				</h1>

				<div className="grid">
					{data.map(user => (
						<Link key={user._id} href={`/users/${user._id}`}>
							<a className="card">
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
		</>
	);
}
