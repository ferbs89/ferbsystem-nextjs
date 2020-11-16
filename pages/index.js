import Head from 'next/head';
import Link from 'next/link';

export default function Home() {
	return (
		<>
			<Head>
				<title>Ferbsystem</title>
				<link rel="icon" href="/favicon.ico" />
			</Head>

			<main className="main">
				<h1 className="title">
					Ferbsystem
				</h1>

				<div className="grid">
					<Link href="/users">
						<a className="card">
							<h3>Usuários &rarr;</h3>
							<p></p>
						</a>
					</Link>
				</div>
			</main>
		</>
	);
}
